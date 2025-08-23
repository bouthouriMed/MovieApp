// WatchListPage.test.tsx
import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { ToastContainer } from "react-toastify";
import { configureStore } from "@reduxjs/toolkit";
import WatchListPage from "./WatchListPage";
import watchListReducer from "../../store/watchListSlice";
import authReducer from "../../store/authSlice";
import * as apiSlice from "../../store/apiSlice"; // mock RTK query

function createTestStore(preloadedState?: any) {
  return configureStore({
    reducer: {
      auth: authReducer,
      watchList: watchListReducer,
    },
    preloadedState,
  });
}

describe("WatchListPage", () => {
  let store: ReturnType<typeof createTestStore>;

  const initialState = {
    auth: { sessionId: "sess123", accountId: 1 },
    watchList: {
      items: [
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

    // Mock API hooks
    jest
      .spyOn(apiSlice, "useDeleteFromWatchlistMutation")
      .mockReturnValue([
        jest.fn(() => Promise.resolve({ data: { success: true } })),
      ] as any);

    jest.spyOn(apiSlice, "useGetWatchlistQuery").mockReturnValue({
      data: initialState.watchList.items,
      isLoading: false,
    } as any);
  });

  it("renders watchlist movies", () => {
    render(
      <Provider store={store}>
        <WatchListPage />
        <ToastContainer />
      </Provider>
    );

    expect(screen.getByText("My watchList")).toBeInTheDocument();
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
    fireEvent.click(removeButtons[0]); // remove "Movie One"

    await waitFor(() => {
      const state = store.getState().watchList.items;
      expect(state.find((m) => m.id === 1)).toBeUndefined();
    });
  });
});
