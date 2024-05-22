import Building from "./components/Building";

// App component sets up the basic parameters for the building and elevators
export default function App() {
  const NUM_OF_FLOORS = 15; // Total number of floors in the building
  const NUM_OF_ELEVATORS = 3; // Total number of elevators in the building
  const FLOOR_HEIGHT = 110; // Height of each floor in pixels
  const WAIT_TIME = 2000; // Wait time in milliseconds for elevator stops
  const TIME_FOR_FLOOR = 500; // Time in milliseconds to travel one floor

  return (
    <div className="container">
      <Building
        numOfFloors={NUM_OF_FLOORS}
        numOfElevators={NUM_OF_ELEVATORS}
        floorHeight={FLOOR_HEIGHT}
        waitTime={WAIT_TIME}
        timeForFloor={TIME_FOR_FLOOR}
      />
    </div>
  );
}
