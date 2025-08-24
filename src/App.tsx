import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import MovieDetailPage from "./pages/movieDetailPage/MovieDetailPage";
import "./styles/global.scss";
import { useTMDBAuth } from "./hooks/useTMDBAuth";
import WatchListPage from "./pages/watchListPage/WatchListPage";
import "./App.scss";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import AuthCallbackPage from "./pages/authCallbackPage/AuthCallbackPage";
import { clearWatchList } from "./store/watchListSlice";

function App() {
  const { login } = useTMDBAuth();

  const dispatch = useDispatch();

  const sessionId = localStorage.getItem("tmdbSessionId");
  // const accountId = localStorage.getItem("tmdbAccountId");

  const account = useSelector((state: any) => state.auth.account);

  console.log({ account });

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWatchList());
  };

  return (
    <Router>
      <header className="app-header">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/watchList">watchList</Link>
          {sessionId ? (
            <div className="logs">
              <p className="user-status">
                <span className="status-badge" />
                <span className="status-text">
                  Logged in as{" "}
                  <span className="username">{account?.account?.username}</span>
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

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/watchList" element={<WatchListPage />} />
          <Route path="/auth/callback" element={<AuthCallbackPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
