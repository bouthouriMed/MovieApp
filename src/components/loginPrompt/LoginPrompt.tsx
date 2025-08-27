import React, { memo } from "react";
import { useTMDBAuth } from "@/hooks/useTMDBAuth";
import "./LoginPrompt.scss";

const LoginPrompt: React.FC = () => {
  const { login } = useTMDBAuth();
  return (
    <div className="login-prompt">
      <div className="card">
        <h2>👀 Your Watchlist Awaits!</h2>
        <p>
          You can only see your watchlist if you’re logged in with your TMDB
          account.
        </p>
        <button className="login-btn" onClick={login}>
          Login with TMDB
        </button>
      </div>
    </div>
  );
};

export default memo(LoginPrompt);
