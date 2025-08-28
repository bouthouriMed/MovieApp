import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTES_URLS } from "@/routes";
import { useTMDBAuth } from "@/hooks/useTMDBAuth";

const AuthCallbackPage = () => {
  const { finalizeLogin } = useTMDBAuth(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Parse query params from hash
    const hash = window.location.hash.replace(/^#/, ""); // remove #
    const searchParams = new URLSearchParams(hash.split("?")[1]);
    const request_token = searchParams.get("request_token");
    const approved = searchParams.get("approved");
    const from = searchParams.get("from") || ROUTES_URLS.Home;

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
