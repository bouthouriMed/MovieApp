import { render } from "@/test-utils";
import Movie from "./Movie";

const movie = { id: 1, title: "Test Movie", poster_path: "/poster.jpg" };

describe("Movie", () => {
  it("matches snapshot", () => {
    const { container } = render(<Movie movie={movie} category="Action" />);
    expect(container).toMatchSnapshot();
  });
});
