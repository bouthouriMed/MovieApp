import { memo } from "react";
import { Link } from "react-router-dom";
import "./emptyWatchlist.scss";
import { ROUTES_URLS } from "@/routes";

function EmptyWatchlist() {
  return (
    <div className="empty-state">
      <p> Empty wishlist </p>
      <h2>Your wishlist is empty 🎥</h2>
      <p>Start exploring movies and add them to your wishlist.</p>
      <Link to={ROUTES_URLS.Home} className="browse-btn">
        Browse Movies
      </Link>
    </div>
  );
}

export default memo(EmptyWatchlist);
