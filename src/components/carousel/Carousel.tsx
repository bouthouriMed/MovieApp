// src/components/Carousel.tsx
import React from "react";
import { Link } from "react-router-dom";
import "./Carousel.scss";

interface CarouselProps {
  movies: any[];
  onAdd?: (movie: any) => void;
}

const Carousel: React.FC<CarouselProps> = ({ movies, onAdd }) => {
  return (
    <div className="carousel">
      {movies.map((movie) => (
        <Link to={`/movie/${movie.id}`} key={movie.id} className="movie-card">
          <img
            src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
            alt={movie.title}
          />
          {onAdd && (
            <button className="add-btn" onClick={() => onAdd(movie)}>
              ➕
            </button>
          )}
        </Link>
      ))}
    </div>
  );
};

export default Carousel;
