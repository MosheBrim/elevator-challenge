import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { ElevatorSystem } from "./ElevatorSystem";
import { BuildingConfig, ElevatorSystemConfig } from "../types/types";
import { AbstractFactory } from "./AbstractFactory";

export class Factory implements AbstractFactory {
  private config: BuildingConfig;

  constructor(config: BuildingConfig) {
    this.config = config;
  }

  public createElevator(): Elevator {
    const elevatorConfig: ElevatorSystemConfig = {
      floorHeightPx: this.config.floorHeightPx,
      doorOpenTimeMs: this.config.doorOpenTimeMs,
      floorTravelTimeMs: this.config.floorTravelTimeMs
    };
    return new Elevator(elevatorConfig);
  }

  public createFloor(): Floor {
    return new Floor();
  }

  public createElevatorSystem(): ElevatorSystem {
    return new ElevatorSystem(this.config);
  }
}