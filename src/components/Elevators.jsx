import React from "react";
import Elevator from "./Elevator";

export default function Elevators({
  numOfElevators,
  elevatorPositionsArray,
  millisecondsArray,
}) {
  let elevators = [];
  for (let i = 0; i < numOfElevators; i++) {
    elevators.push(
      <Elevator
        key={i}
        newPosition={elevatorPositionsArray[i]}
        milliseconds={millisecondsArray[i]}
      />
    );
  }
  return <div className="elevators">{elevators}</div>;
}
