import { render, screen } from "@testing-library/react";
import { mockedMovie } from "@/__mocks__/test_mocks";
import Info from "./Info";

describe("Info Component", () => {
  it("renders movie title, tagline, meta, rating, and overview", () => {
    render(<Info movie={mockedMovie} />);

    expect(screen.getByText(mockedMovie.title)).toBeInTheDocument();
    expect(screen.getByText(/Test tagline/)).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
    expect(screen.getByText("120 min")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText(/8.0 \/ 10 \(100 votes\)/)).toBeInTheDocument();
    expect(screen.getByText(/Test overview/)).toBeInTheDocument();
  });

  it("matches snapshot", () => {
    const { container } = render(<Info movie={mockedMovie} />);
    expect(container).toMatchSnapshot();
  });
});
