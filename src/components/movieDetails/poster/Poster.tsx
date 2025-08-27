import { memo } from "react";
import "./Poster.scss";

interface PosterProps {
  posterPath: string;
  title: string;
}

const Poster = ({ posterPath, title }: PosterProps) => {
  return (
    <div className="poster">
      <img src={`https://image.tmdb.org/t/p/w500${posterPath}`} alt={title} />
    </div>
  );
};

export default memo(Poster);
