import React from "react";
import Movie from "../movie/Movie";
import "./Carousel.scss";
import useScroll from "@/hooks/useScroll";

interface CarouselProps {
  movies: any[];
  onAdd?: (movie: any) => void;
  category?: string;
}

const Carousel: React.FC<CarouselProps> = ({ movies, onAdd, category }) => {
  const { scrollRef, scrollPos, maxScroll, handleScroll, scroll } = useScroll();

  return (
    <div className="carousel-container">
      <div className={`fade left ${scrollPos > 0 ? "visible" : "hidden"}`} />
      {scrollPos > 0 && (
        <button className="arrow left" onClick={() => scroll("left")}>
          &#8249;
        </button>
      )}

      <div
        className="carousel"
        ref={scrollRef}
        onScroll={handleScroll}
        role="region"
      >
        {movies.map((movie) => (
          <Movie
            key={movie.id}
            movie={movie}
            onAdd={onAdd}
            category={category}
          />
        ))}
      </div>

      <div
        className={`fade right ${scrollPos < maxScroll ? "visible" : "hidden"}`}
      />
      {scrollPos < maxScroll && (
        <button className="arrow right" onClick={() => scroll("right")}>
          &#8250;
        </button>
      )}
    </div>
  );
};

export default Carousel;
