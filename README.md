# Elevator Simulation Project

React and TypeScript simulation that models realistic elevator operations in a multi-floor building using OOP principles.

## Overview

This project implements an elevator system simulation with efficient scheduling algorithms, demonstrating software design patterns in a practical, interactive application.

## Architecture

- **Abstract Factory Pattern**: Creates system components through a centralized factory interface, allowing easy substitution of component families
- **Class-based Design**: Well-defined classes with clear responsibilities
- **Component-based UI**: React components reflecting the logical structure

## Core Classes

- **ElevatorSystem**: Coordinates elevators and handles floor calls
- **Elevator**: Manages state, movement, and scheduling
- **Floor**: Handles floor-specific logic and user interactions
- **Factory**: Creates and configures system components

## Main Algorithm

The elevator selection algorithm:
1. Calculates optimal wait time based on position, queued stops, and travel time
2. Accounts for door operations and inter-floor travel time
3. Uses TypeScript interfaces for strong typing across all state management

## Technologies

- React 18+
- TypeScript 5+
- Vite
- CSS Modules

## Getting Started

### Requirements
- Node.js 16+
- npm 8+ or yarn

### Installation

```sh
# Clone repository
git clone https://github.com/MosheBrim/elevator-challenge.git

# Install dependencies
npm install

# Run development server
npm run dev

# Run tests (if applicable)
npm test
```

## Project Structure

```
src/
  ├── components/  # UI Components
  ├── config/      # Configuration settings
  ├── hooks/       # Custom React hooks
  ├── models/      # Business logic and OOP classes
  └── types/       # TypeScript interfaces and types
```

## Features

- Multiple elevator coordination
- Efficient scheduling algorithms
- Real-time visualization
- Customizable building configuration