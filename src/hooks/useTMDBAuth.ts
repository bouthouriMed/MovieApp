import { useEffect, useState, useCallback } from "react";
import {
  useGetRequestTokenQuery,
  useCreateSessionMutation,
} from "../store/apiSlice";

interface AuthState {
  sessionId: string | null;
  accountId: number | null;
}

export function useTMDBAuth() {
  const [auth, setAuthState] = useState<AuthState>({
    sessionId: localStorage.getItem("tmdbSessionId") || null,
    accountId: Number(localStorage.getItem("tmdbAccountId")) || null,
  });

  const { data: tokenData } = useGetRequestTokenQuery();
  const [createSession] = useCreateSessionMutation();

  // Redirect user to TMDB approval
  const login = useCallback(() => {
    if (tokenData?.request_token) {
      window.location.href = `https://www.themoviedb.org/authenticate/${tokenData.request_token}?redirect_to=${window.location.origin}/auth/callback`;
    }
  }, [tokenData]);

  useEffect(() => {
    const requestToken = new URLSearchParams(window.location.search).get(
      "request_token"
    );

    if (requestToken && !auth.sessionId) {
      (async () => {
        const { data } = await createSession({ request_token: requestToken });
        if (data?.session_id) {
          const res = await fetch(
            `https://api.themoviedb.org/3/account?api_key=${
              import.meta.env.VITE_TMDB_API_KEY_V3
            }&session_id=${data.session_id}`
          );
          const account = await res.json();

          const newAuth = {
            sessionId: data.session_id,
            accountId: account.id,
          };

          localStorage.setItem("tmdbSessionId", newAuth.sessionId);
          localStorage.setItem("tmdbAccountId", newAuth.accountId.toString());
          setAuthState(newAuth);
        }
      })();
    }
  }, [createSession, auth.sessionId]);

  return { auth, login };
}
