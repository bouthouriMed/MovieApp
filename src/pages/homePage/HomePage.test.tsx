import { screen, fireEvent, waitFor } from "@testing-library/react";
import { createTestStore, render } from "@/test-utils";
import HomePage from "./HomePage";
import * as movieSlice from "@/store/movieSlice";

// --- Mock both RTK Query hooks ---
vi.mock("@/store/movieSlice", async () => {
  const actual: any = await vi.importActual("@/store/movieSlice");
  return {
    ...actual,
    useSearchMoviesQuery: vi.fn(),
    useGetMoviesQuery: vi.fn(),
  };
});

describe("HomePage", () => {
  const store = createTestStore();

  beforeEach(() => {
    // Default: no search results
    (movieSlice.useSearchMoviesQuery as any).mockReturnValue({
      data: [],
      isLoading: false,
    });

    // Default: category movies
    (movieSlice.useGetMoviesQuery as any).mockImplementation(
      (category: string) => ({
        data: [
          {
            id: 1,
            title: `${category} Movie One`,
            poster_path: "/poster1.jpg",
          },
          {
            id: 2,
            title: `${category} Movie Two`,
            poster_path: "/poster2.jpg",
          },
        ],
        isLoading: false,
      })
    );
  });

  it("renders movies by category when no search term and redirects on click", async () => {
    render(<HomePage />, { store });

    // Check category sections
    expect(screen.getByText("Popular Movies")).toBeInTheDocument();
    expect(screen.getByText("Top Rated")).toBeInTheDocument();
    expect(screen.getByText("Upcoming")).toBeInTheDocument();

    // Check movies rendered in a category
    const movie = await screen.findByAltText("popular Movie One");
    expect(movie).toBeInTheDocument();

    // Click redirects
    const link = movie.closest("a");
    expect(link).toHaveAttribute("href", "/movie/1");
  });

  it("renders search results when search term is typed and redirects on click", async () => {
    const searchMovies = [
      { id: 10, title: "Search Movie One", poster_path: "/poster10.jpg" },
      { id: 20, title: "Search Movie Two", poster_path: "/poster20.jpg" },
    ];

    (movieSlice.useSearchMoviesQuery as any).mockReturnValue({
      data: searchMovies,
      isLoading: false,
    });

    render(<HomePage />, { store });

    const input = screen.getByRole("textbox");
    fireEvent.change(input, { target: { value: "Search" } });

    // Wait for search results
    await waitFor(() => {
      expect(screen.getByAltText("Search Movie One")).toBeInTheDocument();
      expect(screen.getByAltText("Search Movie Two")).toBeInTheDocument();
    });

    // Click redirects
    const movie = screen.getByAltText("Search Movie One");
    const link = movie.closest("a");
    expect(link).toHaveAttribute("href", "/movie/10");
  });
});
