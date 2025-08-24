import React, { useRef, useState, useEffect } from "react";
import Movie from "../movie/Movie";
import "./Carousel.scss";

interface CarouselProps {
  movies: any[];
  onAdd?: (movie: any) => void;
  category?: string;
}

const Carousel: React.FC<CarouselProps> = ({ movies, onAdd, category }) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPos, setScrollPos] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);

  // Scroll arrows
  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.offsetWidth * 0.8;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  // Handle scroll to show/hide fade edges
  const handleScroll = () => {
    if (scrollRef.current) {
      setScrollPos(scrollRef.current.scrollLeft);
      setMaxScroll(
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  };

  // Initialize maxScroll on mount
  useEffect(() => {
    if (scrollRef.current) {
      setMaxScroll(
        scrollRef.current.scrollWidth - scrollRef.current.clientWidth
      );
    }
  }, [movies]);

  return (
    <div className="carousel-container">
      <div className={`fade left ${scrollPos > 0 ? "visible" : "hidden"}`} />
      {scrollPos > 0 && (
        <button className="arrow left" onClick={() => scroll("left")}>
          &#8249;
        </button>
      )}

      <div className="carousel" ref={scrollRef} onScroll={handleScroll}>
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
