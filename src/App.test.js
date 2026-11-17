import { act, fireEvent, render, screen } from "@testing-library/react";
import App from "./App";

beforeEach(() => {
  jest.useFakeTimers();
  render(<App />);
});

afterEach(() => {
  jest.useRealTimers();
});

test("starts and stops the selected stopwatch", () => {
  const display = screen.getByLabelText("Elapsed time");
  expect(display).toHaveTextContent("00:00:00.000");

  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  act(() => {
    jest.advanceTimersByTime(150);
  });
  expect(display.textContent).not.toBe("00:00:00.000");

  fireEvent.click(screen.getByRole("button", { name: "Stop" }));
  const stoppedTime = display.textContent;
  act(() => {
    jest.advanceTimersByTime(500);
  });
  expect(display).toHaveTextContent(stoppedTime);
});

test("records a lap while the stopwatch is running", () => {
  fireEvent.click(screen.getByRole("button", { name: "Start" }));
  act(() => {
    jest.advanceTimersByTime(100);
  });
  fireEvent.click(screen.getByRole("button", { name: "Lap" }));

  expect(screen.getByText("Lap 1")).toBeInTheDocument();
});

test("adds another stopwatch", () => {
  fireEvent.click(screen.getByRole("button", { name: "+ Add stopwatch" }));

  expect(screen.getByDisplayValue("Stopwatch 2")).toBeInTheDocument();
});
