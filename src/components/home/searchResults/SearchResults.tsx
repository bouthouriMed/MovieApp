import Carousel from "@/components/carousel/Carousel";

interface SearchResultsProps {
  searchTerm: string;
  results: any[];
  isLoading: boolean;
  onAdd: (movie: any) => void;
}

function SearchResults({
  searchTerm,
  results,
  isLoading,
  onAdd,
}: SearchResultsProps) {
  if (!searchTerm) return null;

  return (
    <section>
      <h2>Search Results</h2>
      {isLoading ? (
        <div>Searching...</div>
      ) : (
        <Carousel movies={results || []} onAdd={onAdd} category={undefined} />
      )}
    </section>
  );
}

export default SearchResults;
