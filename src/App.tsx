import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./styles/global.scss";
import { useTMDBAuth } from "./hooks/useTMDBAuth";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "./store/authSlice";
import { clearWatchList } from "./store/watchListSlice";
import { routes } from "./routes";
import NavBar from "./components/navBar/NavBar";

function App() {
  const { login } = useTMDBAuth();

  const dispatch = useDispatch();

  const sessionId = localStorage.getItem("tmdbSessionId");

  const account = useSelector((state: any) => state.auth.account);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearWatchList());
  };

  return (
    <Router basename="MovieApp">
      <NavBar
        sessionId={sessionId}
        account={account}
        login={login}
        handleLogout={handleLogout}
      />

      <main>
        <Routes>
          {routes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
        </Routes>
      </main>
    </Router>
  );
}

export default App;
