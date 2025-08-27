import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WatchButton from "./WatchButton";

describe("WatchButton Component", () => {
  it("renders add button when not in watchlist", () => {
    render(
      <WatchButton
        isInWatchlist={false}
        auth={{ sessionId: "abc" }}
        toggleWatchlist={() => {}}
      />
    );
    expect(screen.getByText(/Add to Wishlist/)).toBeInTheDocument();
  });

  it("renders remove button when in watchlist", () => {
    render(
      <WatchButton
        isInWatchlist={true}
        auth={{ sessionId: "abc" }}
        toggleWatchlist={() => {}}
      />
    );
    expect(screen.getByText(/Remove from Wishlist/)).toBeInTheDocument();
  });

  it("shows login prompt if not logged in", () => {
    render(
      <WatchButton
        isInWatchlist={false}
        auth={{ sessionId: null }}
        toggleWatchlist={() => {}}
      />
    );
    expect(screen.getByText(/Login to Add to wishlist/)).toBeInTheDocument();
  });

  it("calls toggleWatchlist when clicked", async () => {
    const toggle = vi.fn();
    const user = userEvent.setup();

    render(
      <WatchButton
        isInWatchlist={false}
        auth={{ sessionId: "abc" }}
        toggleWatchlist={toggle}
      />
    );

    await user.click(screen.getByText(/Add to Wishlist/));
    expect(toggle).toHaveBeenCalledTimes(1);
  });
});
