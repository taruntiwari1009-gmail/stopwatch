# Stopwatch

A multi-stopwatch React application with live elapsed-time tracking, lap recording and individually named timers.

## Features

- Run multiple independent stopwatches
- Start, pause/stop and reset the selected stopwatch
- Record lap times
- Rename each stopwatch
- Switch between timers without losing their elapsed time
- Responsive layout for desktop and mobile

## Tech stack

- React 18
- Create React App
- React Icons

## Getting started

### Requirements

- Node.js (LTS recommended)
- npm

### Install dependencies

```bash
npm ci
```

### Start the development server

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000).

### Run tests

```bash
npm test
```

### Create a production build

```bash
npm run build
```

## Timing behavior

Each stopwatch stores its elapsed duration and start timestamp. The display refreshes periodically, while stop and lap actions calculate elapsed time from timestamps rather than relying on the number of interval callbacks.

## License

No license has been specified. Contact the repository owner before reusing or redistributing this project.
