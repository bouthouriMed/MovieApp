import React from "react";
import { screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import WatchListPage from "./WatchListPage";
import * as movieSlice from "@/store/movieSlice"; // RTK query hooks
import { describe, it, beforeEach, expect, vi } from "vitest";
import { createTestStore, render } from "@/test-utils";

// --- Mock environment ---
vi.mock("@/config/env", () => ({
  env: {
    VITE_TMDB_API_KEY: "test_api_key",
    VITE_TMDB_API_KEY_V3: "test_api_key_v3",
  },
}));

describe("WatchListPage", () => {
  let store = createTestStore();

  const initialState = {
    auth: { sessionId: "sess123", accountId: 1, account: {} },
    watchList: {
      movies: [
        {
          id: 1,
          title: "Movie One",
          poster_path: "/poster1.jpg",
          release_date: "2023-01-01",
          vote_average: 7.5,
        },
        {
          id: 2,
          title: "Movie Two",
          poster_path: "/poster2.jpg",
          release_date: "2023-02-01",
          vote_average: 8.0,
        },
      ],
    },
  };

  beforeEach(() => {
    store = createTestStore(initialState);

    // --- Mock RTK Query hooks ---
    vi.spyOn(movieSlice, "useGetWatchlistQuery").mockReturnValue({
      data: initialState.watchList.movies,
      isLoading: false,
    } as any);

    vi.spyOn(movieSlice, "useDeleteFromWatchlistMutation").mockReturnValue([
      vi.fn(() => Promise.resolve({ data: { success: true } })),
    ] as any);
  });

  it("renders watchlist movies", () => {
    render(
      <Provider store={store}>
        <WatchListPage />
        <ToastContainer />
      </Provider>
    );

    expect(screen.getByText("My Wishlist")).toBeInTheDocument();
    expect(screen.getByText("Movie One")).toBeInTheDocument();
    expect(screen.getByText("Movie Two")).toBeInTheDocument();
  });

  it("removes a movie from the watchlist", async () => {
    render(
      <Provider store={store}>
        <WatchListPage />
        <ToastContainer />
      </Provider>
    );

    const removeButtons = screen.getAllByText("✖ Remove");
    fireEvent.click(removeButtons[0]);

    await waitFor(() => {
      const state = store.getState().watchList.movies;
      expect(state.find((m) => m.id === 1)).toBeUndefined();
    });
  });

  it("shows login prompt when user is not logged in", () => {
    // Create a store with empty auth
    const store = createTestStore({ auth: { sessionId: "", accountId: null } });

    render(
      <Provider store={store}>
        <WatchListPage />
      </Provider>
    );

    // Expect the login prompt to appear
    expect(screen.getByText(/Your Watchlist Awaits!/i)).toBeInTheDocument();
    expect(
      screen.getByText(/You can only see your watchlist if you’re logged in/i)
    ).toBeInTheDocument();

    // Expect the login button to exist
    expect(
      screen.getByRole("button", { name: /Login with TMDB/i })
    ).toBeInTheDocument();
  });
});
