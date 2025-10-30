# HedgeservCalculatorTask - Angular Calculator App
A simple yet fully functional calculator built with Angular, featuring reactive state management via RxJS and clean component-based architecture.

## Features

- Real-time calculation and display using BehaviorSubjects and Observables
- Full support for:
  - Basic arithmetic operations (+, −, ×, ÷)
  - Decimal numbers
  - Percentage
  - Sign toggle (±)
  - Expression evaluation
- Calculation history with instant load & restore
- Error handling for invalid expressions 
- Clean separation of logic via a dedicated CalculatorService

## Core Architecture

- CalculatorService handles:
  - Input parsing and expression building
  - Math evaluation using mathjs
  - History management with reactive streams
- CalculatorComponent displays and controls user input
- HistoryComponent lists previous calculations and allows restoring them


## Tech Stack
- Angular  20.3.7
- RxJS
- mathjs

## Setup

```bash
git clone https://github.com/tisho91/hedgeserv-calculator-task.git
cd hedgeserv-calculator-task
npm install
npm start
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.


## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```
