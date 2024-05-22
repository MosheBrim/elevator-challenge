import React, { useState, useEffect } from "react";

export default function Floor({
  index,
  floorStatus,
  handleElevatorCall,
}) {
  // Handle the elevator call when the button is clicked
  const handleClick = () => {
    handleElevatorCall(index);
  };

  const [timer, setTimer] = useState("00:00");

  useEffect(() => {
    // Calculate the initial timer value based on the remaining wait time
    const seconds = Math.floor(floorStatus.remainingWaitTime / 1000);
    const centiseconds = Math.floor(
      (floorStatus.remainingWaitTime % 1000) / 10
    );
    const formattedTime = `${padZero(seconds)}:${padZero(centiseconds)}`;
    setTimer(formattedTime);

    // Update the timer every 10 milliseconds
    const interval = setInterval(() => {
      setTimer((prevTimer) => {
        const [seconds, centiseconds] = prevTimer.split(":").map(Number);
        if (centiseconds === 0 && seconds === 0) {
          clearInterval(interval);
          return "00:00";
        }
        const newCentiseconds = centiseconds > 0 ? centiseconds - 1 : 99;
        const newSeconds = centiseconds === 0 ? seconds - 1 : seconds;
        return `${padZero(newSeconds)}:${padZero(newCentiseconds)}`;
      });
    }, 10);

    // Clear the interval when the component is unmounted or when the remaining wait time changes
    return () => clearInterval(interval);
  }, [floorStatus.remainingWaitTime]);

  // Function to pad single-digit numbers with a leading zero
  function padZero(value) {
    return value.toString().padStart(2, "0");
  }

  return (
    <div className="floor-container">
      <div className="black-line"></div>
      <div className="floor">
        <button
          className={`metal linear ${floorStatus.isWaiting ? "floor-active" : ""}`}
          onClick={handleClick}
        >
          {index}
        </button>
        {floorStatus.isWaiting && (
          <div className="timer-container">
            <span className="timer">{timer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
