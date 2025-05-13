import "./floor.css";
import { FloorState } from "../types/types";
import { useTimer } from "../hooks/useTimer";

interface FloorProps {
  index: number;
  floorState: FloorState;
  handleElevatorCall: (floorNum: number) => void;
}

export default function Floor({
  index,
  floorState,
  handleElevatorCall,
}: FloorProps) {
  const timer = useTimer(floorState.estimatedWaitTimeMs);

  return (
    <div className="floor-container">
      <div className="floor-divider"></div>
      <div className="floor">
        <button
          title={`${index}`}
          className={`metal linear ${
            floorState.isCallActive ? "button-active" : ""
          }`}
          onClick={() => handleElevatorCall(index)}
        >
          {index}
        </button>
        {floorState.isCallActive && !floorState.hasElevator && (
          <div className="timer-container">
            <span className="timer">{timer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
