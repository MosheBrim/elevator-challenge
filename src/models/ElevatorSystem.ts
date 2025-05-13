import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { Factory } from "./Factory";
import { BuildingConfig, ElevatorState, FloorState } from "../types/types";

export class ElevatorSystem {
  private elevators: Elevator[];
  private floors: Floor[];
  private factory: Factory;
  private floorCount: number;
  private elevatorCount: number;
  private config: BuildingConfig;

  constructor(config: BuildingConfig) {
    this.floorCount = config.floorCount;
    this.elevatorCount = config.elevatorCount;
    this.config = config;

    // Initialize factory
    this.factory = new Factory(config);

    // Initialize floors
    this.floors = Array(this.floorCount)
      .fill(null)
      .map(() => this.factory.createFloor());

    // Initialize elevators
    this.elevators = Array(this.elevatorCount)
      .fill(null)
      .map(() => this.factory.createElevator());
  }

  public getElevatorStates(): ElevatorState[] {
    return this.elevators.map((elevator) => elevator.getState());
  }

  public getFloorStates(): FloorState[] {
    return this.floors.map((floor) => floor.getState());
  }

  public findClosestElevator(floorNum: number): {
    elevatorIndex: number | null;
    waitTime: number;
  } {
    let minTime = Infinity;
    let closestElevator: number | null = null;

    this.elevators.forEach((elevator, index) => {
      const elevatorTime = elevator.calculateWaitTime(floorNum);

      if (elevatorTime < minTime) {
        minTime = elevatorTime;
        closestElevator = index;
      }
    });

    return {
      elevatorIndex: closestElevator,
      waitTime: minTime,
    };
  }

  public handleElevatorCall(floorNum: number): void {
    if (!this.floors[floorNum].isCallableForElevator()) {
      return;
    }

    const { elevatorIndex, waitTime } = this.findClosestElevator(floorNum);

    if (elevatorIndex !== null) {
      this.floors[floorNum].activateCall(waitTime);
      this.elevators[elevatorIndex].addToQueue(floorNum);
      this.processElevatorQueues();
    }
  }

  private processElevatorQueues(): void {
    this.elevators.forEach((elevator, index) => {
      if (elevator.canProcessNextFloor()) {
        const nextFloor = elevator.getNextFloor();
        if (nextFloor !== null) {
          this.moveElevator(index, nextFloor);
        }
      }
    });
  }

  private moveElevator(elevatorIndex: number, targetFloor: number): void {
    const elevator = this.elevators[elevatorIndex];
    elevator.moveTo(targetFloor);

    // Use targetFloor reference for setTimeout callback
    const targetFloorRef = targetFloor;

    // Set a timeout for when the elevator arrives at the target floor
    setTimeout(() => {
      elevator.arrive(targetFloorRef);

      // Update floor state
      this.floors[targetFloorRef].setElevatorPresent(true);

      // Start closing doors 0.5 seconds before the wait time ends
      const doorOpenTime = this.config.doorOpenTimeMs - 500;

      // First timeout to start closing the doors
      setTimeout(() => {
        elevator.closeDoors();
      }, doorOpenTime);

      // Second timeout for when the elevator is ready to move again
      setTimeout(() => {
        this.floors[targetFloorRef].setElevatorPresent(false);

        // Process the next elevator in the queue
        this.processElevatorQueues();
      }, this.config.doorOpenTimeMs);
    }, this.elevators[elevatorIndex].getState().travelTimeMs);
  }
}
