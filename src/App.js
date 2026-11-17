import React, { useEffect, useRef, useState } from "react";
import "./App.css";

const formatDuration = (milliseconds) => {
  const total = Math.max(0, Math.floor(milliseconds));
  const hours = Math.floor(total / 3600000);
  const minutes = Math.floor((total % 3600000) / 60000);
  const seconds = Math.floor((total % 60000) / 1000);
  const millis = total % 1000;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(millis).padStart(3, "0")}`;
};

const createStopwatch = (id, name) => ({
  id,
  name,
  elapsedMs: 0,
  isRunning: false,
  startedAt: null,
  laps: [],
});

function App() {
  const nextId = useRef(2);
  const [stopwatches, setStopwatches] = useState([
    createStopwatch(1, "Stopwatch 1"),
  ]);
  const [selectedId, setSelectedId] = useState(1);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setStopwatches((current) => {
        if (!current.some((stopwatch) => stopwatch.isRunning)) return current;

        const now = Date.now();
        return current.map((stopwatch) =>
          stopwatch.isRunning
            ? { ...stopwatch, elapsedMs: now - stopwatch.startedAt }
            : stopwatch
        );
      });
    }, 50);

    return () => window.clearInterval(intervalId);
  }, []);

  const selectedStopwatch =
    stopwatches.find((stopwatch) => stopwatch.id === selectedId) || stopwatches[0];

  const addStopwatch = () => {
    const id = nextId.current;
    nextId.current += 1;
    setStopwatches((current) => [
      ...current,
      createStopwatch(id, `Stopwatch ${current.length + 1}`),
    ]);
    setSelectedId(id);
  };

  const updateStopwatch = (id, updates) => {
    setStopwatches((current) =>
      current.map((stopwatch) =>
        stopwatch.id === id ? { ...stopwatch, ...updates } : stopwatch
      )
    );
  };

  const handleStart = () => {
    if (!selectedStopwatch || selectedStopwatch.isRunning) return;
    updateStopwatch(selectedStopwatch.id, {
      isRunning: true,
      startedAt: Date.now() - selectedStopwatch.elapsedMs,
    });
  };

  const handleStop = () => {
    if (!selectedStopwatch?.isRunning) return;
    updateStopwatch(selectedStopwatch.id, {
      isRunning: false,
      elapsedMs: Date.now() - selectedStopwatch.startedAt,
      startedAt: null,
    });
  };

  const handleReset = () => {
    if (!selectedStopwatch) return;
    updateStopwatch(selectedStopwatch.id, {
      elapsedMs: 0,
      isRunning: false,
      startedAt: null,
      laps: [],
    });
  };

  const handleLap = () => {
    if (!selectedStopwatch) return;
    const elapsed = selectedStopwatch.isRunning
      ? Date.now() - selectedStopwatch.startedAt
      : selectedStopwatch.elapsedMs;

    updateStopwatch(selectedStopwatch.id, {
      laps: [...selectedStopwatch.laps, elapsed],
    });
  };

  return (
    <main className="stopwatch-app">
      <section className="stopwatch-main">
        <header className="stopwatch-header">
          <div>
            <h1>Stopwatch</h1>
            <p>Multiple timers, one clear view.</p>
          </div>
          <button type="button" className="add-stopwatch" onClick={addStopwatch}>
            + Add stopwatch
          </button>
        </header>

        {selectedStopwatch && (
          <section className="active-stopwatch" aria-label="Selected stopwatch">
            <h2>{selectedStopwatch.name}</h2>
            <output className="main-time" aria-label="Elapsed time" aria-live="off">
              {formatDuration(selectedStopwatch.elapsedMs)}
            </output>
            <div className="main-controls">
              <button type="button" onClick={handleStart} disabled={selectedStopwatch.isRunning}>
                Start
              </button>
              <button type="button" onClick={handleLap} disabled={selectedStopwatch.elapsedMs === 0}>
                Lap
              </button>
              <button type="button" onClick={handleStop} disabled={!selectedStopwatch.isRunning}>
                Stop
              </button>
              <button type="button" onClick={handleReset} disabled={selectedStopwatch.elapsedMs === 0 && selectedStopwatch.laps.length === 0}>
                Reset
              </button>
            </div>

            <div className="lap-section">
              <div className="lap-heading">
                <h3>Laps</h3>
                <span>{selectedStopwatch.laps.length}</span>
              </div>
              {selectedStopwatch.laps.length === 0 ? (
                <p className="empty-laps">Your lap times will appear here.</p>
              ) : (
                <ol className="lap-list">
                  {selectedStopwatch.laps.map((lap, index) => (
                    <li key={`${selectedStopwatch.id}-lap-${index}`}>
                      <span>Lap {index + 1}</span>
                      <strong>{formatDuration(lap)}</strong>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </section>
        )}
      </section>

      <aside className="stopwatch-sidebar" aria-label="Your stopwatches">
        <h2>My stopwatches</h2>
        {stopwatches.map((stopwatch) => (
          <article
            className={`stopwatch-card ${stopwatch.id === selectedId ? "selected" : ""}`}
            key={stopwatch.id}
          >
            <input
              aria-label="Stopwatch name"
              value={stopwatch.name}
              onChange={(event) => updateStopwatch(stopwatch.id, { name: event.target.value })}
            />
            <p className="sidebar-time">{formatDuration(stopwatch.elapsedMs)}</p>
            <div className="sidebar-card-footer">
              <span>{stopwatch.laps.length} laps</span>
              <button
                type="button"
                onClick={() => setSelectedId(stopwatch.id)}
                aria-pressed={stopwatch.id === selectedId}
              >
                {stopwatch.id === selectedId ? "Selected" : "Select"}
              </button>
            </div>
          </article>
        ))}
      </aside>
    </main>
  );
}

export default App;
