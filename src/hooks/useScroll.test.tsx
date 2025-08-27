import { renderHook, act } from "@testing-library/react";
import useScroll from "./useScroll";

const mockElement = {
  offsetWidth: 200,
  clientWidth: 200,
  scrollWidth: 1000,
  scrollLeft: 0,
  scrollBy: vi.fn(),
} as unknown as HTMLDivElement;

describe("useScroll", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("initializes scrollPos and maxScroll", () => {
    const { result } = renderHook(() => useScroll());
    // attach mock ref
    result.current.scrollRef.current = mockElement;
    act(() => {
      result.current.handleScroll();
    });
    expect(result.current.scrollPos).toBe(0);
    expect(result.current.maxScroll).toBe(800); // 1000 - 200
  });

  it("updates scrollPos when scrolled", () => {
    const { result } = renderHook(() => useScroll());
    result.current.scrollRef.current = {
      ...mockElement,
      scrollLeft: 150,
    };
    act(() => {
      result.current.handleScroll();
    });
    expect(result.current.scrollPos).toBe(150);
  });

  it("scrolls right correctly", () => {
    const { result } = renderHook(() => useScroll());
    result.current.scrollRef.current = mockElement;
    act(() => {
      result.current.scroll("right");
    });
    expect(mockElement.scrollBy).toHaveBeenCalledWith({
      left: 160, // 200 * 0.8
      behavior: "smooth",
    });
  });

  it("scrolls left correctly", () => {
    const { result } = renderHook(() => useScroll());
    result.current.scrollRef.current = mockElement;
    act(() => {
      result.current.scroll("left");
    });
    expect(mockElement.scrollBy).toHaveBeenCalledWith({
      left: -160,
      behavior: "smooth",
    });
  });
});
