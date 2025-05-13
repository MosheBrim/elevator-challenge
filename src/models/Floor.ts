import { FloorState } from "../types/types";

export class Floor {
  private state: FloorState;
  
  constructor() {
    this.state = {
      isCallActive: false,
      hasElevator: false,
      estimatedWaitTimeMs: 0,
    };
  }

  public getState(): FloorState {
    return { ...this.state };
  }

  // Set call button on with wait time
  public activateCall(estimatedWaitTimeMs: number): void {
    this.state.isCallActive = true;
    this.state.estimatedWaitTimeMs = estimatedWaitTimeMs;
  }

  public cancelCall(): void {
    this.state.isCallActive = false;
    this.state.estimatedWaitTimeMs = 0;
  }

  // Update when elevator arrives/leaves
  public setElevatorPresent(present: boolean): void {
    this.state.hasElevator = present;
    if (present) {
      this.state.isCallActive = false;
      this.state.estimatedWaitTimeMs = 0;
    }
  }

  // Check if can call elevator
  public isCallableForElevator(): boolean {
    return !this.state.isCallActive && !this.state.hasElevator;
  }
}