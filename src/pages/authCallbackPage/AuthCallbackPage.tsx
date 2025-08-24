import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTMDBAuth } from "../../hooks/useTMDBAuth";

const AuthCallbackPage = () => {
  const { finalizeLogin } = useTMDBAuth(false);
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const request_token = params.get("request_token");
    const approved = params.get("approved");
    const from = params.get("from") || "/"; // fallback to home

    if (approved === "true" && request_token) {
      finalizeLogin(request_token).then(() => {
        navigate(from);
      });
    } else {
      navigate("/");
    }
  }, [finalizeLogin, navigate]);

  return <p>Authorizing... please wait</p>;
};

export default AuthCallbackPage;
