import { describe, it, expect, vi, beforeEach } from "vitest";
import { act } from "@testing-library/react";
import { renderHookWithStore, createTestStore } from "@/test-utils";
import { useWatchlistToggle } from "@/hooks/useWatchlistToggle";
import { WatchListState } from "@/store/watchListSlice";
import { mockedMovie } from "@/__mocks__/test_mocks";
import { Movie } from "@/pages/movieDetailPage/types";

// --- Mock RTK Query mutations ---
vi.mock("@/store/movieSlice", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@/store/movieSlice")>();
  return {
    ...actual,
    useAddToWatchlistMutation: () => [
      vi.fn().mockResolvedValue({ data: { success: true } }),
    ],
    useDeleteFromWatchlistMutation: () => [
      vi.fn().mockResolvedValue({ data: { success: true } }),
    ],
  };
});

// Mock toast
vi.mock("react-toastify", () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    info: vi.fn(),
  },
}));

describe("useWatchlistToggle", () => {
  let store: ReturnType<typeof createTestStore>;

  beforeEach(() => {
    store = createTestStore({
      auth: {
        sessionId: "sess-123",
        accountId: "acc-456",
        isAuthenticated: true,
      },
      watchList: { movies: [] } as WatchListState,
    });
  });

  it("adds movie to watchlist", async () => {
    const { result } = renderHookWithStore(
      () => useWatchlistToggle(mockedMovie as Movie),
      { store }
    );

    expect(result.current.isInWatchlist).toBe(false);

    await act(async () => {
      await result.current.toggle();
    });

    const state = store.getState().watchList.movies;
    expect(state).toHaveLength(1);
    expect(state[0].id).toBe(mockedMovie.id);
    expect(result.current.isInWatchlist).toBe(true);
  });

  it("removes movie from watchlist if already present", async () => {
    store = createTestStore({
      auth: {
        sessionId: "sess-123",
        accountId: "acc-456",
        isAuthenticated: true,
      },
      watchList: { movies: [mockedMovie] },
    });

    const { result } = renderHookWithStore(
      () => useWatchlistToggle(mockedMovie as Movie),
      { store }
    );

    expect(result.current.isInWatchlist).toBe(true);

    await act(async () => {
      await result.current.toggle();
    });

    const state = store.getState().watchList.movies;
    expect(state).toHaveLength(0);
    expect(result.current.isInWatchlist).toBe(false);
  });
});
