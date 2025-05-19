import { Elevator } from "./Elevator";
import { Floor } from "./Floor";
import { ElevatorSystem } from "./ElevatorSystem";

export interface AbstractFactory {
  createElevator(): Elevator;
  createFloor(): Floor;
  createElevatorSystem(): ElevatorSystem;
}
