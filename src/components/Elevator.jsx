import React from "react";

export default function Elevator({ elevatorStatus }) {
  return (
    <img
      // Apply the elevator's position and transition effect based on its status
      style={{
        transform: `translateY(-${elevatorStatus.destination}px)`,
        transition: `transform ${elevatorStatus.timeToReachFloor}ms ease-in-out`,
      }}
      className="elevator"
      src="././elv.png"
      alt="elevator"
    />
  );
}
