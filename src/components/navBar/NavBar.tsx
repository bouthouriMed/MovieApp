import { memo } from "react";
import { Link } from "react-router-dom";
import "./NavBar.scss";

interface NavbarProps {
  sessionId: string | null;
  account: any;
  login: () => void;
  handleLogout: () => void;
}

function NavBar({ sessionId, account, login, handleLogout }: NavbarProps) {
  return (
    <header className="app-header">
      <nav>
        <Link to="/">Home</Link>
        <Link to="/watchList">Wishlist</Link>
        {sessionId ? (
          <div className="logs">
            <p className="user-status">
              <span className="status-badge" />
              <span className="status-text">
                Logged in as{" "}
                <span className="username">{account?.username}</span>
              </span>
            </p>

            <button
              className="logout-btn"
              title="Logout"
              onClick={handleLogout}
            >
              🔒
            </button>
          </div>
        ) : (
          <button className="login-btn" onClick={login}>
            Login with TMDB
          </button>
        )}
      </nav>
    </header>
  );
}

export default memo(NavBar);
