import { useState, useRef, useEffect } from "react";
import { BuildingConfig, ElevatorState, FloorState } from "../types/types";
import { ElevatorSystem } from "../models/ElevatorSystem";
import { Factory } from "../models/Factory";

export function useElevatorSystem(buildingConfig: BuildingConfig) {
  // Create a factory first
  const factoryRef = useRef<Factory>(new Factory(buildingConfig));

  // Use the factory to create the ElevatorSystem
  const elevatorSystemRef = useRef<ElevatorSystem>(
    factoryRef.current.createElevatorSystem()
  );

  // Initialize states using the already created ElevatorSystem
  const [elevatorStates, setElevatorStates] = useState<ElevatorState[]>(
    elevatorSystemRef.current.getElevatorStates()
  );

  const [floorStates, setFloorStates] = useState<FloorState[]>(
    elevatorSystemRef.current.getFloorStates()
  );

  useEffect(() => {
    // Set up state synchronization with the elevator system
    const syncInterval = setInterval(() => {
      setElevatorStates(elevatorSystemRef.current.getElevatorStates());
      setFloorStates(elevatorSystemRef.current.getFloorStates());
    }, 100); // Update UI state every 100ms

    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  // Handle elevator call from a floor
  const handleElevatorCall = (floorNum: number): void => {
    // Handle the call in our elevator system
    elevatorSystemRef.current.handleElevatorCall(floorNum);
  };

  return {
    elevatorStates,
    floorStates,
    handleElevatorCall,
  };
}
