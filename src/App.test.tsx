import { screen, fireEvent } from "@testing-library/react";
import * as useTMDBAuthHook from "./hooks/useTMDBAuth";
import * as movieSlice from "./store/movieSlice"; // RTK query hooks
import { createTestStore, render } from "./test-utils";
import App from "./App";

describe("App", () => {
  const mockLogin = vi.fn();
  const mockFinalizeLogin = vi.fn();

  beforeEach(() => {
    mockLogin.mockClear();
    mockFinalizeLogin.mockClear();
    localStorage.clear();
  });

  const store = createTestStore({ auth: { sessionId: "abc", accountId: 1 } });

  it("renders login button when not logged in", () => {
    vi.spyOn(useTMDBAuthHook, "useTMDBAuth").mockReturnValue({
      auth: { sessionId: null, accountId: null, account: null },
      login: mockLogin,
      finalizeLogin: mockFinalizeLogin,
    });

    render(<App />, { store });

    expect(screen.getByText(/login with tmdb/i)).toBeInTheDocument();
  });

  it("renderWithoutRouters logout button when session exists", () => {
    localStorage.setItem("tmdbSessionId", "abc123");

    vi.spyOn(useTMDBAuthHook, "useTMDBAuth").mockReturnValue({
      auth: {
        sessionId: "abc123",
        accountId: 1,
        account: { id: 1, username: "test" },
      },
      login: mockLogin,
      finalizeLogin: mockFinalizeLogin,
    });

    render(<App />, { store });

    expect(screen.getByTitle("Logout")).toBeInTheDocument();
    expect(screen.getByText(/logged in as/i)).toBeInTheDocument();
  });

  it("navigates to watchlist page when link clicked", () => {
    vi.spyOn(movieSlice, "useGetWatchlistQuery").mockReturnValue({
      data: [
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
      isLoading: false,
    } as any);
    render(<App />, { store });

    const watchlistLink = screen.getByText(/wishlist/i);
    fireEvent.click(watchlistLink);

    expect(screen.getByText(/My Wishlist/i)).toBeInTheDocument();
  });
});
