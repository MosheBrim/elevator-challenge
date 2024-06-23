import React, { useState, useEffect } from "react";
import Floor from "./Floor";
import Elevator from "./Elevator";

export default function Building({
  numOfFloors,
  numOfElevators,
  floorHeight,
  waitTime,
  timeForFloor,
}) {
  const dingSound = new Audio("ding.mp3");

  // Initialize the state for elevator statuses
  const [elevatorStatuses, setElevatorStatuses] = useState(
    Array(numOfElevators)
      .fill()
      .map(() => ({
        currentFloor: 0,
        destination: 0,
        isMoving: false,
        isWaiting: false,
        queueCalls: [],
        timeToReachFloor: 0,
        startMoving: null,
        startWaiting: null,
      }))
  );

  // Initialize the state for floor statuses
  const [floorStatuses, setFloorStatuses] = useState(
    Array(numOfFloors)
      .fill()
      .map(() => ({
        isWaiting: false,
        isElevatorInUse: false,
        remainingWaitTime: 0,
      }))
  );

  // Handle elevator call from a floor
  const handleElevatorCall = (floorNum) => {
    if (
      floorStatuses[floorNum].isWaiting ||
      floorStatuses[floorNum].isElevatorInUse
    ) {
      return;
    }
    const closestElevator = findClosestElevator(floorNum);
    if (closestElevator !== null) {
      const travelTime = calculateElevatorWaitTime(closestElevator, floorNum);
      addToElevatorQueue(closestElevator, floorNum);
      setFloorStatuses((prevStatuses) => {
        const newStatuses = [...prevStatuses];
        newStatuses[floorNum] = {
          isWaiting: true,
          remainingWaitTime: travelTime,
        };
        return newStatuses;
      });
      handleElevatorQueue();
    }
  };

  // Find the closest elevator to the called floor
  const findClosestElevator = (floorNum) => {
    let minTime = Infinity;
    let closestElevator = null;

    elevatorStatuses.forEach((elevator, index) => {
      const elevatorTime = calculateElevatorWaitTime(index, floorNum);
      
      if (elevatorTime < minTime) {
        minTime = elevatorTime;
        closestElevator = index;
      }
    });

    return closestElevator;
  };

  // Calculate the wait time for a given elevator to reach a specified floor
  const calculateElevatorWaitTime = (elevatorIndex, floorNum) => {
    const elevator = elevatorStatuses[elevatorIndex];

    let totalWaitTime = 0;
    let currentFloor = elevator.currentFloor;

    // Calculate the current position if the elevator is moving or waiting
    if (elevator.isMoving) {
      const now = Date.now();
      const elapsedTime = now - elevator.startMoving;
      const distanceMoved = elapsedTime / timeForFloor;
      const direction = elevator.destination > elevator.currentFloor ? 1 : -1;
      currentFloor += direction * distanceMoved;
    } else if (elevator.isWaiting) {
      const now = Date.now();
      const elapsedTime = waitTime - (now - elevator.startWaiting);
      totalWaitTime += elapsedTime;
    }

    // Calculate total wait time including all queued stops
    const allStops = [...elevator.queueCalls, floorNum];
    allStops.forEach((stop, index) => {
      const timeToReachStop = Math.abs(currentFloor - stop) * timeForFloor;
      totalWaitTime += timeToReachStop;
      if (index > 0) {
        totalWaitTime += waitTime;
      }
      currentFloor = stop;
    });

    return totalWaitTime;
  };

  // Add a floor to the elevator's queue
  const addToElevatorQueue = (elevatorIndex, floorNum) => {
    setElevatorStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses[elevatorIndex].queueCalls.push(floorNum);
      return newStatuses;
    });
  };

  // Handle the elevator's queue to move elevators as needed
  const handleElevatorQueue = () => {
    setElevatorStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      newStatuses.forEach((elevator, index) => {
        // If the elevator is not moving or waiting, move it to the next queued floor
        if (
          !elevator.isMoving &&
          !elevator.isWaiting &&
          elevator.queueCalls.length > 0
        ) {
          const nextFloor = elevator.queueCalls[0];
          moveElevator(index, nextFloor);
        }
      });
      return newStatuses;
    });
  };

  // Move the elevator to the target floor
  const moveElevator = (elevatorIndex, targetFloor) => {
    const elevator = elevatorStatuses[elevatorIndex];

    const distance = Math.abs(elevator.currentFloor - targetFloor);
    const milliseconds = distance * timeForFloor;

    setElevatorStatuses((prevStatuses) => {
      const newStatuses = [...prevStatuses];
      const elevator = newStatuses[elevatorIndex];
      elevator.isMoving = true;
      elevator.isWaiting = false;
      elevator.destination = targetFloor * floorHeight;
      elevator.timeToReachFloor = milliseconds;
      elevator.startMoving = Date.now();
      elevator.startWaiting = null;

      // Set timeout to simulate elevator movement duration
      setTimeout(() => {
        dingSound.playbackRate = 6.0;
        dingSound.play();
        setElevatorStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          const elevator = newStatuses[elevatorIndex];
          elevator.isMoving = false;
          elevator.isWaiting = true;
          elevator.currentFloor = targetFloor;
          elevator.timeToReachFloor = 0;
          elevator.queueCalls.shift();
          elevator.startMoving = null;
          elevator.startWaiting = Date.now();

          return newStatuses;
        });
        setFloorStatuses((prevStatuses) => {
          const newStatuses = [...prevStatuses];
          if (newStatuses[targetFloor]) {
            newStatuses[targetFloor].isWaiting = false;
            newStatuses[targetFloor].isElevatorInUse = true;
            newStatuses[targetFloor].remainingWaitTime = 0;
          }
          return newStatuses;
        });

        // Set timeout for elevator waiting duration
        setTimeout(() => {
          setElevatorStatuses((prevStatuses) => {
            const newStatuses = [...prevStatuses];
            const elevator = newStatuses[elevatorIndex];
            elevator.isWaiting = false;
            elevator.startMoving = null;
            elevator.startWaiting = null;
            return newStatuses;
          });
          setFloorStatuses((prevStatuses) => {
            const newStatuses = [...prevStatuses];
            if (newStatuses[targetFloor]) {
              newStatuses[targetFloor].isElevatorInUse = false;
            }
            return newStatuses;
          });
          handleElevatorQueue();
        }, waitTime);
      }, milliseconds);

      return newStatuses;
    });
  };

  // Render the floors
  const floors = Array.from({ length: numOfFloors }, (_, i) => (
    <Floor
      key={i}
      index={i}
      handleElevatorCall={handleElevatorCall}
      floorStatus={floorStatuses[i]}
    />
  ));

  // Render the elevators
  const elevators = Array.from({ length: numOfElevators }, (_, i) => (
    <Elevator key={i} elevatorStatus={elevatorStatuses[i]} />
  ));

  return (
    <div className="container">
      <div className="floors">{floors}</div>
      <div className="elevators">{elevators}</div>
    </div>
  );
}
