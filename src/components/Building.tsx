import Floor from "./Floor";
import Elevator from "./Elevator";
import { BuildingConfig } from "../types/types";
import { useElevatorSystem } from "../hooks/useElevatorSystem";
import "./building.css";

export default function Building(buildingConfig: BuildingConfig) {
  const { elevatorStates, floorStates, handleElevatorCall } =
    useElevatorSystem(buildingConfig);

  const floors = Array.from({ length: buildingConfig.floorCount }, (_, i) => (
    <Floor
      key={i}
      index={i}
      handleElevatorCall={handleElevatorCall}
      floorState={floorStates[i]}
    />
  ));

  const elevators = Array.from(
    { length: buildingConfig.elevatorCount },
    (_, i) => <Elevator key={i} elevatorState={elevatorStates[i]} />
  );

  return (
    <div className="building-container">
      <div className="floors">{floors}</div>
      <div className="elevators">{elevators}</div>
    </div>
  );
}
