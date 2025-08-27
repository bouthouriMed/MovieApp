import { render } from "@/test-utils";
import EmptyWatchlist from "./EmptyWatchlist";

describe("EmptyWatchlist", () => {
  it("matches snapshot", () => {
    const { container } = render(<EmptyWatchlist />);

    expect(container).toMatchSnapshot();
  });
});
