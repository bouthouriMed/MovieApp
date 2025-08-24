import { useCallback } from "react";
import {
  useGetRequestTokenQuery,
  useCreateSessionMutation,
} from "../store/apiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../store/authSlice";

interface AuthState {
  sessionId: string | null;
  accountId: number | null;
}

export function useTMDBAuth(doRequestToken = true) {
  // const [auth, setAuthState] = useState<AuthState>({
  //   sessionId: localStorage.getItem("tmdbSessionId") || null,
  //   accountId: Number(localStorage.getItem("tmdbAccountId")) || null,
  // });

  const dispatch = useDispatch();

  const auth = useSelector((state: any) => state.auth as AuthState);

  const { data: tokenData } = useGetRequestTokenQuery(undefined, {
    skip: !doRequestToken,
  });
  const [createSession] = useCreateSessionMutation();

  // Redirect user to TMDB approval
  const login = useCallback(() => {
    if (tokenData?.request_token) {
      const currentPath = window.location.pathname; // e.g. /watchlist
      window.location.href = `https://www.themoviedb.org/authenticate/${
        tokenData.request_token
      }?redirect_to=${
        window.location.origin
      }/auth/callback?from=${encodeURIComponent(currentPath)}`;
    }
  }, [tokenData]);

  // Function to finalize login with request_token
  const finalizeLogin = useCallback(
    async (requestToken: string) => {
      const { data } = await createSession({ request_token: requestToken });
      if (data?.session_id) {
        const res = await fetch(
          `https://api.themoviedb.org/3/account?api_key=${
            import.meta.env.VITE_TMDB_API_KEY_V3
          }&session_id=${data.session_id}`
        );
        const account = await res.json();

        console.log({ account });

        const newAuth = {
          sessionId: data.session_id,
          account,
        };

        localStorage.setItem("tmdbSessionId", newAuth.sessionId);
        localStorage.setItem("tmdbAccountId", newAuth.account.id.toString());
        // setAuthState(newAuth);
        dispatch(setAuth(newAuth));
      }
    },
    [createSession]
  );

  return { auth, login, finalizeLogin };
}
