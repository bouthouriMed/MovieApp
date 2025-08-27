import React from "react";
import { screen } from "@testing-library/react";
import MovieSection from "./MovieSection";
import * as movieSlice from "@/store/movieSlice";
import { render } from "@/test-utils";

vi.mock("@/store/movieSlice", async () => {
  const actual: any = await vi.importActual("@/store/movieSlice");
  return {
    ...actual,
    useGetMoviesQuery: vi.fn(),
  };
});

describe("MovieSection", () => {
  beforeEach(() => {
    (movieSlice.useGetMoviesQuery as any).mockReturnValue({
      data: [
        { id: 1, title: "Movie One", poster_path: "/poster1.jpg" },
        { id: 2, title: "Movie Two", poster_path: "/poster2.jpg" },
      ],
      isLoading: false,
    });
  });

  it("renders the title and movies", () => {
    render(
      <MovieSection title="Popular Movies" category="popular" onAdd={vi.fn()} />
    );

    expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    expect(screen.getByAltText("Movie One")).toBeInTheDocument();
    expect(screen.getByAltText("Movie Two")).toBeInTheDocument();
  });

  it("shows loading indicator when isLoading is true", () => {
    (movieSlice.useGetMoviesQuery as any).mockReturnValue({
      data: [],
      isLoading: true,
    });
    render(
      <MovieSection title="Top Rated" category="top_rated" onAdd={vi.fn()} />
    );
    expect(screen.getByTestId("loading")).toBeInTheDocument();
  });
});
