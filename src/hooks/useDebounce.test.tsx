import { renderHook, act } from "@testing-library/react";
import { useDebounce } from "./useDebounce";

vi.useFakeTimers();

describe("useDebounce", () => {
  it("should update the debounced value after delay", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );

    // Initial value
    expect(result.current).toBe("a");

    // Update the value
    rerender({ value: "b", delay: 500 });

    // Still old value before timeout
    expect(result.current).toBe("a");

    // Fast-forward timers
    act(() => {
      vi.advanceTimersByTime(500);
    });

    // Now value should update
    expect(result.current).toBe("b");
  });

  it("should reset timer if value changes quickly", () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: "a", delay: 500 } }
    );

    rerender({ value: "b", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300); // not enough time
    });

    rerender({ value: "c", delay: 500 });

    act(() => {
      vi.advanceTimersByTime(300);
    });

    // Should still be "a" because 500ms not reached after last change
    expect(result.current).toBe("a");

    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Now 500ms passed from last change
    expect(result.current).toBe("c");
  });
});
