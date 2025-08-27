import { memo } from "react";
import { Movie } from "src/pages/movieDetailPage/types";
import "./AdditionalInfo.scss";

interface AdditionalInfoProps {
  movie: Movie;
}

const AdditionalInfo = ({ movie }: AdditionalInfoProps) => {
  return (
    <div className="additional-info">
      <h2>Additional Information</h2>
      <div className="grid">
        <div>
          <strong>Spoken Languages:</strong>{" "}
          {movie?.spoken_languages?.map((l) => l?.english_name)?.join(", ")}
        </div>
        <div>
          <strong>Budget:</strong> ${movie?.budget?.toLocaleString()}
        </div>
        <div>
          <strong>Revenue:</strong> ${movie?.revenue?.toLocaleString()}
        </div>
        <div>
          <strong>Popularity:</strong> {movie?.popularity?.toFixed(0)}
        </div>
      </div>

      {movie.production_companies.length > 0 && (
        <div className="companies">
          <h3>Production Companies</h3>
          <div className="logos">
            {movie.production_companies.map((c) => (
              <div key={c.id} className="company">
                {c.logo_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w200${c.logo_path}`}
                    alt={c.name}
                  />
                ) : (
                  <span>{c.name}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(AdditionalInfo);
