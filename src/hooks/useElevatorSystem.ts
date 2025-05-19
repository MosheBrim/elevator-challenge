import { useState, useRef, useEffect } from "react";
import { BuildingConfig, ElevatorState, FloorState } from "../types/types";
import { ElevatorSystem } from "../models/ElevatorSystem";
import { AbstractFactory } from "../models/AbstractFactory";
import { Factory } from "../models/Factory";

export function useElevatorSystem(buildingConfig: BuildingConfig) {
  // Keep model objects between renders
  const factoryRef = useRef<AbstractFactory>(
    new Factory(buildingConfig)
    // Abstract Factory Pattern: Can swap with other factory implementations
    // (e.g. ExpressElevatorFactory for faster elevators) without changing client code
  );

  const elevatorSystemRef = useRef<ElevatorSystem>(
    factoryRef.current.createElevatorSystem()
  );

  const [elevatorStates, setElevatorStates] = useState<ElevatorState[]>(
    elevatorSystemRef.current.getElevatorStates()
  );

  const [floorStates, setFloorStates] = useState<FloorState[]>(
    elevatorSystemRef.current.getFloorStates()
  );

  // Update UI every 100ms
  useEffect(() => {
    const syncInterval = setInterval(() => {
      setElevatorStates(elevatorSystemRef.current.getElevatorStates());
      setFloorStates(elevatorSystemRef.current.getFloorStates());
    }, 100);

    return () => {
      clearInterval(syncInterval);
    };
  }, []);

  const handleElevatorCall = (floorNum: number): void => {
    elevatorSystemRef.current.handleElevatorCall(floorNum);
  };

  return {
    elevatorStates,
    floorStates,
    handleElevatorCall,
  };
}
