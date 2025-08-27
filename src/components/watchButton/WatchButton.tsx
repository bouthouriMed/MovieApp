import { memo } from "react";
import "./WatchButton.scss";

interface WatchButtonProps {
  isInWatchlist: boolean;
  auth: { sessionId: string | null };
  toggleWatchlist: () => void;
}

const WatchButton = ({
  isInWatchlist,
  auth,
  toggleWatchlist,
}: WatchButtonProps) => {
  return (
    <button
      className="watch-btn"
      onClick={toggleWatchlist}
      disabled={!auth.sessionId}
    >
      {auth.sessionId
        ? isInWatchlist
          ? "❌ Remove from Wishlist"
          : "🎟️ Add to Wishlist"
        : "🔒 Login to Add to wishlist"}
    </button>
  );
};

export default memo(WatchButton);
