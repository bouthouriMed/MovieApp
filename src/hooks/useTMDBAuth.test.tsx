import { renderHookWithStore, createTestStore } from "../test-utils";
import { useTMDBAuth } from "./useTMDBAuth";
import {
  useCreateRequestTokenQuery,
  useCreateSessionMutation,
} from "@/store/userSlice";
import { act } from "@testing-library/react";

vi.mock("@/store/userSlice", async (importOriginal) => {
  const actual = (await importOriginal()) as any;

  return {
    ...actual,
    useCreateRequestTokenQuery: vi.fn(),
    useCreateSessionMutation: vi.fn(),
  };
});

Object.defineProperty(window, "location", {
  writable: true,
  value: {
    href: "",
    assign: vi.fn(),
    pathname: "/watchlist",
    origin: "http://localhost",
  },
});

describe("useTMDBAuth", () => {
  let store = createTestStore();

  beforeEach(() => {
    store = createTestStore();
    localStorage.clear();
    window.location.href = "";
    (window.location.assign as any).mockImplementation(
      (url: string) => (window.location.href = url)
    );

    (useCreateRequestTokenQuery as any).mockReturnValue({
      data: { request_token: "token123" },
    });
    const createSessionMock = vi
      .fn()
      .mockResolvedValue({ data: { session_id: "sess123" } });
    (useCreateSessionMutation as any).mockReturnValue([createSessionMock]);
  });

  afterEach(() => vi.restoreAllMocks());

  it("redirects to TMDB login on login()", () => {
    const { result } = renderHookWithStore(() => useTMDBAuth(), { store });
    result.current.login();
    expect(window.location.href).toContain("token123");
    expect(window.location.href).toContain("/auth/callback");
  });

  it("finalizeLogin sets auth in Redux and localStorage", async () => {
    const accountData = { id: 42, username: "John" };
    global.fetch = vi
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve(accountData) } as any);
    (useCreateSessionMutation as any).mockReturnValue([
      vi.fn().mockResolvedValue({ data: { session_id: "sess123" } }),
    ]);

    const { result } = renderHookWithStore(() => useTMDBAuth(false), { store });
    await act(async () => {
      await result.current.finalizeLogin("token123");
    });

    expect(localStorage.getItem("tmdbSessionId")).toBe("sess123");
    expect(localStorage.getItem("tmdbAccountId")).toBe("42");

    const state = store.getState().auth;
    expect(state.sessionId).toBe("sess123");
    expect(state.account?.id).toBe(42);
    expect(state.account?.username).toBe("John");
  });

  it("does not call login if no token", () => {
    (useCreateRequestTokenQuery as any).mockReturnValue({ data: null });
    const { result } = renderHookWithStore(() => useTMDBAuth(), { store });
    result.current.login();
    expect(window.location.href).toBe("");
  });
});
