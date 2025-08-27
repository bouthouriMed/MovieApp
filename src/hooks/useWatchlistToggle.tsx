import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import {
  useAddToWatchlistMutation,
  useDeleteFromWatchlistMutation,
} from "@/store/movieSlice";
import { addTowatchList, removeFromwatchList } from "@/store/watchListSlice";
import { useTMDBAuth } from "./useTMDBAuth";
import { useDispatch, useSelector } from "react-redux";
import { Movie } from "@/pages/movieDetailPage/types";

export const useWatchlistToggle = (movie: Movie) => {
  const dispatch = useDispatch();
  const watchList = useSelector((state: any) => state.watchList.movies);
  const { auth } = useTMDBAuth(false);
  const [addToWatchlist] = useAddToWatchlistMutation();
  const [deleteFromWatchlist] = useDeleteFromWatchlistMutation();
  const [isInWatchlist, setIsInWatchlist] = useState(false);

  useEffect(() => {
    if (movie)
      setIsInWatchlist(watchList.some((m: Movie) => m.id === movie.id));
  }, [movie, watchList]);

  const toggle = async () => {
    if (!auth.sessionId || !auth.accountId) {
      toast.error("You must be logged in to manage your watchlist.");
      return;
    }
    if (!movie) return;

    try {
      if (isInWatchlist) {
        const res = await deleteFromWatchlist({
          movieId: movie.id,
          session_id: auth.sessionId,
          account_id: auth.accountId,
        });
        if ("data" in res && res.data.success) {
          dispatch(removeFromwatchList(movie.id));
          setIsInWatchlist(false);
        }
      } else {
        const res = await addToWatchlist({
          movieId: movie.id,
          session_id: auth.sessionId,
          account_id: auth.accountId,
        });
        if ("data" in res && res.data.success) {
          dispatch(addTowatchList(movie));
          setIsInWatchlist(true);
        }
      }
    } catch (err) {
      toast.error("Something went wrong!");
      console.error(err);
    }
  };

  return { isInWatchlist, toggle };
};
