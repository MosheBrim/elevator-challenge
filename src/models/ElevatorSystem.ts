import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { AbstractFactory } from "./AbstractFactory";
import { Factory } from "./Factory";
import { BuildingConfig, ElevatorState, FloorState } from "../types/types";

export class ElevatorSystem {
  private elevators: Elevator[];
  private floors: Floor[];
  private factory: AbstractFactory;
  private floorCount: number;
  private elevatorCount: number;
  private config: BuildingConfig;

  constructor(config: BuildingConfig) {
    this.floorCount = config.floorCount;
    this.elevatorCount = config.elevatorCount;
    this.config = config;

    this.factory = new Factory(config);

    this.floors = Array(this.floorCount)
      .fill(null)
      .map(() => this.factory.createFloor());

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

  // Find fastest elevator for this floor
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

    // Send best elevator to handle call
    const { elevatorIndex, waitTime } = this.findClosestElevator(floorNum);

    if (elevatorIndex !== null) {
      this.floors[floorNum].activateCall(waitTime);
      this.elevators[elevatorIndex].addToQueue(floorNum);
      this.processElevatorQueues();
    }
  }

  // Start pending elevator trips
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

  // Control elevator movement with timers
  private moveElevator(elevatorIndex: number, targetFloor: number): void {
    const elevator = this.elevators[elevatorIndex];
    elevator.moveTo(targetFloor);

    const targetFloorRef = targetFloor;

    // Travel time
    setTimeout(() => {
      elevator.arrive(targetFloorRef);

      this.floors[targetFloorRef].setElevatorPresent(true);

      const doorOpenTime = this.config.doorOpenTimeMs - 500;

      // Door close time
      setTimeout(() => {
        elevator.closeDoors();
      }, doorOpenTime);

      // Process next floor after doors close
      setTimeout(() => {
        this.floors[targetFloorRef].setElevatorPresent(false);

        this.processElevatorQueues();
      }, this.config.doorOpenTimeMs);
    }, this.elevators[elevatorIndex].getState().travelTimeMs);
  }
}
