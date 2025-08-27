import { useNavigate } from "react-router-dom";
import { ROUTES_URLS } from "@/routes";
import { useGetMoviesQuery } from "@/store/movieSlice";
import Carousel from "@/components/carousel/Carousel";
import Loading from "@/components/loadingIndicator/LoadingIndicator";
import "./MovieSection.scss";

interface MovieSectionProps {
  title: string;
  category: string;
  onAdd: (movie: any) => void;
}

function MovieSection({ title, category, onAdd }: MovieSectionProps) {
  const { data: movies, isLoading, isError } = useGetMoviesQuery(category);

  const navigate = useNavigate();

  if (isError) navigate(ROUTES_URLS.Oops);

  return (
    <section>
      <h2>{title}</h2>
      {isLoading ? (
        <Loading />
      ) : (
        <Carousel movies={movies || []} onAdd={onAdd} category={category} />
      )}
    </section>
  );
}

export default MovieSection;
