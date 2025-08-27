import { screen, fireEvent, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import MovieDetailPage from "./MovieDetailPage";
import * as api from "@/store/movieSlice";
import { createTestStore, render } from "@/test-utils";
import { mockedMovie } from "@/__mocks__/test_mocks";

// --- Mock API hooks ---
vi.mock("@/store/movieSlice", async () => {
  const actual = await vi.importActual("@/store/movieSlice");
  return {
    ...actual,
    useGetMovieByIdQuery: () => ({ data: mockedMovie, isLoading: false }),
    useGetRequestTokenQuery: () => ({
      data: { request_token: "fake-token" },
      isLoading: false,
    }),
    useAddToWatchlistMutation: () => [
      vi.fn(() => Promise.resolve({ data: { success: true } })),
    ],
    useDeleteFromWatchlistMutation: () => [
      vi.fn(() => Promise.resolve({ data: { success: true } })),
    ],
  };
});

describe("MovieDetailPage Integration", () => {
  it("renders movie details correctly and adds to watchlist", async () => {
    const store = createTestStore({
      auth: { sessionId: "abc", accountId: 1 },
      watchList: { movies: [] },
    });

    render(<MovieDetailPage />, { store });

    // Movie title and tagline
    expect(screen.getByText(mockedMovie.title)).toBeInTheDocument();
    expect(screen.getByText(/Test tagline/i)).toBeInTheDocument();

    // Watchlist button
    const btn = screen.getByRole("button", {
      name: /Add to Wishlist/i,
    });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeEnabled();

    // Click to add
    fireEvent.click(btn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.watchList.movies).toHaveLength(1);
      expect(state.watchList.movies[0].id).toBe(mockedMovie.id);
    });
  });

  it("does not add to wishlist if API fails", async () => {
    const store = createTestStore({
      auth: { sessionId: "abc", accountId: 1 },
      watchList: { movies: [] },
    });

    const failAdd = vi.fn().mockResolvedValue({ data: { success: false } });

    vi.spyOn(api, "useAddToWatchlistMutation").mockReturnValue([
      failAdd,
      {
        data: undefined,
        error: undefined,
        isLoading: false,
        isSuccess: false,
        isError: false,
        reset: () => {},
      },
    ]);

    render(<MovieDetailPage />, { store });

    const btn = screen.getByRole("button", { name: /Add to Wishlist/i });
    fireEvent.click(btn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.watchList.movies).toHaveLength(0);
    });
  });

  it("disables watchlist button if user is not logged in", async () => {
    const store = createTestStore({
      auth: { sessionId: null, accountId: null },
      watchList: { movies: [] },
    });

    render(<MovieDetailPage />, { store });

    const btn = screen.getByRole("button", { name: /Login to Add/i });
    expect(btn).toBeInTheDocument();
    expect(btn).toBeDisabled();

    fireEvent.click(btn);

    await waitFor(() => {
      const state = store.getState();
      expect(state.watchList.movies).toHaveLength(0);
    });
  });
});
