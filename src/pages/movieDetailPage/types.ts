export interface Movie {
  id: number;
  title: string;
  original_title?: string;
  overview?: string;
  release_date: string;
  runtime?: number;
  vote_average: number;
  tagline?: string;
  poster_path: string | null | undefined;
  backdrop_path?: string | null;
  genres: { id: number; name: string }[];
  production_companies: {
    id: number;
    name: string;
    logo_path: string | null;
  }[];
  budget?: number;
  revenue?: number;
  homepage?: string;
  spoken_languages?: {
    english_name: string;
  }[];
  popularity?: number;
  vote_count?: number;
}
