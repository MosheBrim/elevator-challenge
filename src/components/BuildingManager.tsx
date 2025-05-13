import React, { useState } from "react";
import Building from "./Building";
import { BuildingData, ElevatorSystemConfig } from "../types/types";
import "./buildingManager.css";
import {
  ELEVATOR_CONFIG,
  DEFAULT_BUILDING,
  NEW_BUILDING_CONFIG,
} from "../config/config";

interface BuildingManagerProps {
  elevatorConfig?: ElevatorSystemConfig;
}

export default function BuildingManager({
  elevatorConfig = ELEVATOR_CONFIG,
}: BuildingManagerProps): React.ReactElement {
  const [buildings, setBuildings] = useState<BuildingData[]>([
    { id: 1, ...DEFAULT_BUILDING },
  ]);
  const [newFloorCount, setNewFloorCount] = useState<number>(
    NEW_BUILDING_CONFIG.floorCount
  );    
  const [newElevatorCount, setNewElevatorCount] = useState<number>(
    NEW_BUILDING_CONFIG.elevatorCount
  );

  const addBuilding = (e: React.FormEvent) => {
    e.preventDefault();
    const newId =
      buildings.length > 0 ? Math.max(...buildings.map((b) => b.id)) + 1 : 1;
    setBuildings([
      ...buildings,
      {
        id: newId,
        floorCount: newFloorCount,
        elevatorCount: newElevatorCount,
      },
    ]);
  };

  return (
    <>
      <div className="building-manager">
        <h1>Elevator Challenge</h1>
        <form onSubmit={addBuilding} className="building-form">
          <div className="form-group">
            <label htmlFor="floorCount">Floors:</label>
            <input
              type="number"
              id="floorCount"
              min="2"
              value={newFloorCount.toString()}
              onChange={(e) => setNewFloorCount(parseInt(e.target.value))}
            />
          </div>
          <div className="form-group">
            <label htmlFor="elevatorCount">Elevators:</label>
            <input
              type="number"
              id="elevatorCount"
              min="1"
              value={newElevatorCount.toString()}
              onChange={(e) => setNewElevatorCount(parseInt(e.target.value))}
            />
          </div>
          <button type="submit" className="add-building-btn">
            Add Building
          </button>
        </form>
      </div>

      {/* Buildings container */}
      <div className="buildings-container">
        {buildings.map((building, index) => (
          <div key={building.id} className="building-wrapper">
            <div className="building-header">
              <h2>Building #{index + 1}</h2>
              <p>
                {building.floorCount} floors, {building.elevatorCount} elevators
              </p>
              <button
                onClick={() =>
                  setBuildings(buildings.filter((b) => b.id !== building.id))
                }
                className="remove-building-btn"
              >
                Remove
              </button>
            </div>
            <Building
              floorCount={building.floorCount}
              elevatorCount={building.elevatorCount}
              floorHeightPx={elevatorConfig.floorHeightPx}
              doorOpenTimeMs={elevatorConfig.doorOpenTimeMs}
              floorTravelTimeMs={elevatorConfig.floorTravelTimeMs}
            />
          </div>
        ))}
      </div>
    </>
  );
}
