import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import HomePage from "./pages/homePage/HomePage";
import MovieDetailPage from "./pages/movieDetailPage/MovieDetailPage";
import "./styles/global.scss";
import { useTMDBAuth } from "./hooks/useTMDBAuth";
import WatchListPage from "./pages/watchListPage/WatchListPage";
import "./App.scss";

function App() {
  const { auth, login } = useTMDBAuth();

  return (
    <Router>
      <header className="app-header">
        <nav>
          <Link to="/">Home</Link>
          <Link to="/watchList">watchList</Link>
          {auth.sessionId ? (
            <p style={{ margin: "0px" }}>
              ✅ Logged in as account {auth.accountId}
            </p>
          ) : (
            <button onClick={login}>Login with TMDB</button>
          )}
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movie/:id" element={<MovieDetailPage />} />
          <Route path="/watchList" element={<WatchListPage />} />
        </Routes>
      </main>
    </Router>
  );
}

export default App;
