import { useLocation, useParams } from "react-router-dom";
import { useGetMovieByIdQuery } from "@/store/movieSlice";
import { useTMDBAuth } from "@/hooks/useTMDBAuth";
import Loading from "@/components/loadingIndicator/LoadingIndicator";

import "./MovieDetailPage.scss";
import Poster from "@/components/movieDetails/poster/Poster";
import Info from "@/components/movieDetails/info/Info";
import WatchButton from "@/components/watchButton/WatchButton";
import AdditionalInfo from "@/components/movieDetails/additionalInfo/AdditionalInfo";
import { useWatchlistToggle } from "@/hooks/useWatchlistToggle";

const MovieDetailPage = () => {
  const { auth } = useTMDBAuth();

  const location = useLocation();
  const category = location.state?.category || "";

  const { id } = useParams<{ id: string }>();
  const { data: movie, isLoading } = useGetMovieByIdQuery(id ? Number(id) : 0);

  const { isInWatchlist, toggle } = useWatchlistToggle(movie);

  if (isLoading || !movie) return <Loading />;

  return (
    <div
      className={`movie-detail-page ${category}`}
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
      }}
    >
      <div className="overlay" />
      <div className="content">
        <Poster posterPath={movie.poster_path} title={movie.title} />
        <Info movie={movie}>
          <WatchButton
            isInWatchlist={isInWatchlist}
            auth={auth}
            toggleWatchlist={toggle}
          />
        </Info>
      </div>

      <AdditionalInfo movie={movie} />
    </div>
  );
};

export default MovieDetailPage;
