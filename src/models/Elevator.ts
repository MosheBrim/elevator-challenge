import { ElevatorState, ElevatorSystemConfig } from "../types/types";

const sharedDingSound = new Audio("ding.mp3");
sharedDingSound.playbackRate = 3.0;

export class Elevator {
  private state: ElevatorState;
  private config: ElevatorSystemConfig;

  constructor(config: ElevatorSystemConfig) {
    this.config = config;

    this.state = {
      floor: 0,
      targetFloor: 0,
      isMoving: false,
      isDoorOpen: false,
      floorQueue: [],
      travelTimeMs: 0,
      moveStartTime: null,
      doorOpenTime: null,
    };
  }

  public getState(): ElevatorState {
    return { ...this.state };
  }

  public addToQueue(floorNum: number): void {
    if (!this.state.floorQueue.includes(floorNum)) {
      this.state.floorQueue.push(floorNum);
    }
  }

  public canProcessNextFloor(): boolean {
    return (
      !this.state.isMoving &&
      !this.state.isDoorOpen &&
      this.state.floorQueue.length > 0
    );
  }

  public getNextFloor(): number | null {
    return this.state.floorQueue.length > 0 ? this.state.floorQueue[0] : null;
  }

  private playArrivalSound(): void {
    sharedDingSound.currentTime = 0;
    sharedDingSound.play();
  }

  // Start moving to target floor
  public moveTo(targetFloor: number): void {
    const distance = Math.abs(this.state.floor - targetFloor);
    const milliseconds = distance * this.config.floorTravelTimeMs;

    this.state.isMoving = true;
    this.state.isDoorOpen = false;
    this.state.targetFloor = targetFloor * this.config.floorHeightPx;
    this.state.travelTimeMs = milliseconds;
    this.state.moveStartTime = Date.now();
    this.state.doorOpenTime = null;
  }

  // Handle arrival at floor
  public arrive(targetFloor: number): void {
    if (Math.abs(this.state.floor - targetFloor) > 0) {
      this.playArrivalSound();
    }

    this.state.isMoving = false;
    this.state.isDoorOpen = true;
    this.state.floor = targetFloor;
    this.state.travelTimeMs = 0;

    // Remove floor from queue
    if (
      this.state.floorQueue.length > 0 &&
      this.state.floorQueue[0] === targetFloor
    ) {
      this.state.floorQueue.shift();
    }

    this.state.moveStartTime = null;
    this.state.doorOpenTime = Date.now();
  }

  public closeDoors(): void {
    this.state.isDoorOpen = false;
    this.state.doorOpenTime = null;
  }

  private calculateRemainingMovementTime(): number {
    if (this.state.isMoving && this.state.moveStartTime !== null) {
      const elapsedTime = Date.now() - this.state.moveStartTime;
      return Math.max(0, this.state.travelTimeMs - elapsedTime);
    }
    return 0;
  }

  private calculateRemainingDoorOpenTime(): number {
    if (this.state.isDoorOpen && this.state.doorOpenTime !== null) {
      const elapsedTime = Date.now() - this.state.doorOpenTime;
      return Math.max(0, this.config.doorOpenTimeMs - elapsedTime);
    }
    return 0;
  }

  private getCurrentPosition(): number {
    if (this.state.isMoving && this.state.moveStartTime !== null) {
      return Math.floor(this.state.targetFloor / this.config.floorHeightPx);
    }
    return this.state.floor;
  }

  // Calculate wait time to reach a floor
  public calculateWaitTime(floorNum: number): number {
    let totalWaitTime = 0;
    let currentPosition = this.getCurrentPosition();

    // Add current movement time
    totalWaitTime += this.calculateRemainingMovementTime();

    // Add door time
    totalWaitTime += this.calculateRemainingDoorOpenTime();

    let lastPosition = currentPosition;

    // Add time for each stop
    for (const stop of this.state.floorQueue) {
      const floorDistance = Math.abs(lastPosition - stop);
      totalWaitTime += floorDistance * this.config.floorTravelTimeMs;
      totalWaitTime += this.config.doorOpenTimeMs;
      lastPosition = stop;
    }

    // Add time to final floor
    const finalDistance = Math.abs(lastPosition - floorNum);
    totalWaitTime += finalDistance * this.config.floorTravelTimeMs;

    return totalWaitTime;
  }
}
