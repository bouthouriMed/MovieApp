import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES_URLS } from "@/routes";
import { useTMDBAuth } from "@/hooks/useTMDBAuth";

const AuthCallbackPage = () => {
  const { finalizeLogin } = useTMDBAuth(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const request_token = params.get("request_token");
    const approved = params.get("approved");
    const from =
      params.get("from")?.replace(/^\/MovieApp/, "") || ROUTES_URLS.Home; // fallback to home

    if (approved === "true" && request_token) {
      finalizeLogin(request_token).then(() => {
        navigate(from);
      });
    } else {
      navigate(ROUTES_URLS.Home);
    }
  }, [finalizeLogin, navigate]);

  return <p style={{ margin: "20px" }}>Authorizing... please wait</p>;
};

export default AuthCallbackPage;
