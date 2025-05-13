export interface ElevatorState {
  floor: number;
  targetFloor: number;
  isMoving: boolean;
  isDoorOpen: boolean;
  floorQueue: number[];
  travelTimeMs: number;
  moveStartTime: number | null;
  doorOpenTime: number | null;
}

export interface FloorState {
  isCallActive: boolean;
  hasElevator: boolean;
  estimatedWaitTimeMs: number;
}

export interface ElevatorSystemConfig {
  floorHeightPx: number;
  doorOpenTimeMs: number;
  floorTravelTimeMs: number;
}

export interface BuildingConfig extends ElevatorSystemConfig {
  floorCount: number;
  elevatorCount: number;
}

export interface BuildingData {
  id: number;
  floorCount: number;
  elevatorCount: number;
}