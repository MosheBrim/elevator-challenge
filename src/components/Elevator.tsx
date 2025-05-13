import { ElevatorState } from "../types/types";
import "./elevator.css";

interface ElevatorProps {
  elevatorState: ElevatorState;
}

export default function Elevator({ elevatorState }: ElevatorProps) {
  return (
    <div className="elevator-wrapper">
      <div 
        className="elevator-container"
        style={{
          '--target-floor': `-${elevatorState.targetFloor}px`,
          '--travel-time': `${elevatorState.travelTimeMs}ms`
        } as React.CSSProperties}
      >
        <img
          className="elevator"
          src="././elv.png"
          alt="elevator"
        />
        
        <div className={`elevator-door elevator-door-left ${elevatorState.isDoorOpen ? 'elevator-door-open' : ''}`} />
        <div className={`elevator-door elevator-door-right ${elevatorState.isDoorOpen ? 'elevator-door-open' : ''}`} />
      </div>
    </div>
  );
}