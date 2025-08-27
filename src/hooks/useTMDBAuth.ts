import { useCallback } from "react";
import {
  useCreateRequestTokenQuery,
  useCreateSessionMutation,
} from "@/store/userSlice";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "@/store/authSlice";
import type { Account } from "@/store/authSlice";
import { toast } from "react-toastify";

interface AuthState {
  sessionId: string | null;
  accountId: number | null;
  account?: Account | null;
}

export function useTMDBAuth(doRequestToken = true) {
  const dispatch = useDispatch();
  const auth = useSelector((state: any) => state.auth as AuthState);

  const { data: tokenData } = useCreateRequestTokenQuery(undefined, {
    skip: !doRequestToken,
  });
  const [createSession] = useCreateSessionMutation();

  // Redirect user to TMDB approval
  const login = useCallback(() => {
    if (tokenData?.request_token) {
      const currentPath = window.location.hash || "#/";
      localStorage.setItem("tmdbRedirectFrom", currentPath);

      const redirectUrl = `${window.location.origin}/MovieApp/#/auth/callback`;
      window.location.href = `https://www.themoviedb.org/authenticate/${tokenData.request_token}?redirect_to=${redirectUrl}`;
    } else {
      toast.error("No authorisation token");
    }
  }, [tokenData]);

  // FiinalizeLogin : session_id and account_id
  const finalizeLogin = useCallback(
    async (requestToken: string) => {
      const { data } = await createSession({ request_token: requestToken });
      if (data?.session_id) {
        const res = await fetch(
          `https://api.themoviedb.org/3/account?api_key=${
            import.meta.env.VITE_TMDB_API_KEY_V3
          }&session_id=${data.session_id}`
        );
        const account: Account = await res.json();

        dispatch(setAuth({ sessionId: data.session_id, account }));

        localStorage.setItem("tmdbSessionId", data.session_id);
        localStorage.setItem("tmdbAccountId", account.id.toString());
      }
    },
    [createSession, dispatch]
  );

  return { auth, login, finalizeLogin };
}
