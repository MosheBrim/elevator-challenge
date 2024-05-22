# Elevator Simulation Project

A React-based simulation of a building with multiple floors and elevators.

## Overview

This project simulates elevator operations within a building, handling floor calls and managing elevator movements efficiently.

## Components

- **App**: Initializes parameters and renders the `Building` component.
- **Building**: Manages elevator and floor states, handles elevator calls, and renders `Floor` and `Elevator` components.
- **Floor**: Represents each floor with a call button and a wait time display.
- **Elevator**: Displays the elevator and simulates its movement.

## Main Algorithm

1. **Handling Elevator Calls**: Selects the closest available elevator and updates its queue.
2. **Finding Closest Elevator**: Calculates wait times and selects the fastest elevator.
3. **Calculating Wait Time**: Considers current position, queued stops, and travel time.
4. **Moving Elevator**: Simulates elevator movement with delays and handles stops and waits.

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/MosheBrim/elevator-challenge.git
