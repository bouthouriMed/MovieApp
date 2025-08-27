import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "@/store/store";
import { ROUTES_URLS } from "@/routes";
import { setwatchList } from "@/store/watchListSlice";
import { useGetWatchlistQuery } from "@/store/movieSlice";
import LoginPrompt from "@/components/loginPrompt/LoginPrompt";
import Loading from "@/components/loadingIndicator/LoadingIndicator";
import "./WatchListPage.scss";
import WatchListItem from "@/components/watchListItem/WatchListItem";
import EmptyWatchlist from "@/components/emptyWatchlist/EmptyWatchlist";

const WatchListPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const auth = useSelector((state: RootState) => state.auth);
  const watchList = useSelector((state: RootState) => state.watchList.movies);

  const {
    data: apiWatchList,
    isLoading,
    isError,
  } = useGetWatchlistQuery(
    { account_id: auth.accountId!, session_id: auth.sessionId! },
    { skip: !auth.sessionId }
  );

  useEffect(() => {
    if (apiWatchList && watchList.length === 0) {
      dispatch(setwatchList(apiWatchList));
    }
  }, [apiWatchList, watchList.length, dispatch]);

  useEffect(() => {
    if (isError) navigate(ROUTES_URLS.Oops);
  }, []);

  if (!auth.sessionId) return <LoginPrompt />;
  if (isLoading) return <Loading />;
  if (!watchList.length) return <EmptyWatchlist />;

  return (
    <div className="watchList-page">
      <h1>My Wishlist</h1>
      <div className="watchList-grid">
        {watchList.map((movie) => (
          <WatchListItem movie={movie} />
        ))}
      </div>
    </div>
  );
};

export default WatchListPage;
