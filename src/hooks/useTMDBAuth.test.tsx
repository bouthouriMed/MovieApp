import { act } from "@testing-library/react";
import { useTMDBAuth } from "./useTMDBAuth";
import { createTestStore, renderHookWithStore } from "../test-utils";
import {
  useCreateRequestTokenQuery,
  useCreateSessionMutation,
} from "@/store/userSlice";

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
    assign: vi.fn((url: string) => (window.location.href = url)),
    origin: "http://localhost",
  },
});

describe("useTMDBAuth", () => {
  let store = createTestStore();

  beforeEach(() => {
    store = createTestStore();
    localStorage.clear();
    window.location.href = "";
  });

  it("redirects to TMDB login on login() with hash routing", () => {
    (useCreateRequestTokenQuery as any).mockReturnValue({
      data: { request_token: "token123" },
    });

    // MOCK the mutation tuple correctly
    (useCreateSessionMutation as any).mockReturnValue([vi.fn()]);

    const { result } = renderHookWithStore(() => useTMDBAuth(), { store });

    act(() => {
      result.current.login();
    });

    expect(window.location.href).toContain("token123");
    expect(decodeURIComponent(window.location.href)).toContain(
      "/#/auth/callback"
    );
  });

  it("does not call login if no token", () => {
    (useCreateRequestTokenQuery as any).mockReturnValue({ data: null });

    (useCreateSessionMutation as any).mockReturnValue([vi.fn()]);

    const { result } = renderHookWithStore(() => useTMDBAuth(), { store });

    act(() => {
      result.current.login();
    });

    expect(window.location.href).toBe("");
  });

  it("finalizeLogin sets auth in Redux and localStorage", async () => {
    const accountData = { id: 42, username: "John" };
    global.fetch = vi
      .fn()
      .mockResolvedValue({ json: () => Promise.resolve(accountData) } as any);

    const createSessionMock = vi
      .fn()
      .mockResolvedValue({ data: { session_id: "sess123" } });
    (useCreateSessionMutation as any).mockReturnValue([createSessionMock]);

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
});
