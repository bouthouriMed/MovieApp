import { render, screen, waitFor } from "@testing-library/react";
import { ROUTES_URLS } from "@/routes";
import AuthCallbackPage from "./AuthCallbackPage";

// --- Mock useNavigate ---
const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

// --- Mock useTMDBAuth ---
const mockFinalizeLogin = vi.fn();
vi.mock("@/hooks/useTMDBAuth", () => ({
  useTMDBAuth: () => ({
    finalizeLogin: mockFinalizeLogin,
  }),
}));

describe("AuthCallbackPage", () => {
  beforeEach(() => {
    mockNavigate.mockReset();
    mockFinalizeLogin.mockReset();
  });

  it("calls finalizeLogin and navigates to `from` if approved", async () => {
    // Simulate URL: ?request_token=abc&approved=true&from=/watchlist
    window.history.pushState(
      {},
      "",
      `/auth/callback?request_token=abc&approved=true&from=${ROUTES_URLS.WatchList}`
    );

    mockFinalizeLogin.mockResolvedValueOnce(undefined);

    render(<AuthCallbackPage />);

    // Wait for effect to call finalizeLogin
    await waitFor(() => {
      expect(mockFinalizeLogin).toHaveBeenCalledWith("abc");
      expect(mockNavigate).toHaveBeenCalledWith(ROUTES_URLS.WatchList);
    });

    expect(screen.getByText("Authorizing... please wait")).toBeInTheDocument();
  });

  it("navigates home if not approved", async () => {
    window.history.pushState(
      {},
      "",
      "/auth/callback?request_token=abc&approved=false"
    );

    render(<AuthCallbackPage />);

    await waitFor(() => {
      expect(mockFinalizeLogin).not.toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
