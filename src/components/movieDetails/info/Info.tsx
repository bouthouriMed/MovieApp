import { memo, ReactNode } from "react";
import { Movie } from "src/pages/movieDetailPage/types";
import "./Info.scss";

interface InfoProps {
  movie: Movie;
  children?: ReactNode;
}

const Info = ({ movie, children }: InfoProps) => {
  return (
    <div className="info">
      <h1>{movie.title}</h1>
      {movie.tagline && <h3 className="tagline">“{movie.tagline}”</h3>}

      <div className="meta">
        <span>{movie.release_date.slice(0, 4)}</span> •{" "}
        <span>{movie.runtime} min</span> •{" "}
        <span>{movie.genres.map((g) => g.name).join(", ")}</span>
      </div>

      <div className="rating">
        ⭐ {movie.vote_average.toFixed(1)} / 10 ({movie.vote_count} votes)
      </div>

      <p className="overview">{movie.overview}</p>

      {children}
    </div>
  );
};

export default memo(Info);
