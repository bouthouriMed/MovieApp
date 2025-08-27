import { screen, fireEvent } from "@testing-library/react";
import { render } from "@/test-utils";
import LoginPrompt from "./LoginPrompt";

// Mock the useTMDBAuth hook
const mockLogin = vi.fn();

vi.mock("@/hooks/useTMDBAuth", () => ({
  useTMDBAuth: () => ({
    login: mockLogin,
  }),
}));

describe("LoginPrompt", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("matches snapshot", () => {
    const { container } = render(<LoginPrompt />);
    expect(container).toMatchSnapshot();
  });

  it("calls login when button is clicked", () => {
    render(<LoginPrompt />);
    const button = screen.getByRole("button", { name: /Login with TMDB/i });
    fireEvent.click(button);
    expect(mockLogin).toHaveBeenCalledTimes(1);
  });
});
