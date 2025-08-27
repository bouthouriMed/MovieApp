import { render, screen, fireEvent, act } from "@testing-library/react";
import SearchBar from "./SearchBar";

describe("SearchBar", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  it("calls onChange after debounce when typing", async () => {
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} value="" />);

    const input = screen.getByPlaceholderText("Search for a movie...");
    fireEvent.change(input, { target: { value: "Batman" } });

    await act(async () => {
      vi.advanceTimersByTime(500);
    });

    expect(onChange).toHaveBeenCalledWith("Batman");
  });

  it("clears input and calls onChange when clear icon clicked", async () => {
    const onChange = vi.fn();
    render(<SearchBar onChange={onChange} value="Batman" />);

    const input = screen.getByPlaceholderText("Search for a movie...");
    expect(input).toHaveValue("Batman");

    const clearIcon = screen.getByTestId("clear-icon");
    fireEvent.click(clearIcon);

    expect(input).toHaveValue("");
    expect(onChange).toHaveBeenCalledWith("");
  });
});
