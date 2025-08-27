import { render, screen } from "@testing-library/react";
import Poster from "./Poster";
import { describe, it, expect } from "vitest";
import { mockedMovie } from "@/__mocks__/test_mocks";

describe("Poster Component", () => {
  it("renders movie poster with correct alt text and src", () => {
    const { container } = render(
      <Poster posterPath={mockedMovie.poster_path} title={mockedMovie.title} />
    );

    const img = screen.getByAltText(mockedMovie.title);
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute(
      "src",
      `https://image.tmdb.org/t/p/w500${mockedMovie.poster_path}`
    );

    expect(container).toMatchSnapshot();
  });
});
