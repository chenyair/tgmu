import { Movie } from 'shared-types';
import MovieCard from './movie-card';
import TgmuScrollArea from '@/components/tgmu-scroll-area';

interface MoviesListProps {
  movies: Movie[];
}

const MoviesList: React.FC<MoviesListProps> = ({ movies }: MoviesListProps) => {
  return (
    <TgmuScrollArea style={{ height: '90%', width: '70%' }}>
      <div
        className="d-grid gap-3"
        style={{ alignItems: 'center', gridTemplateColumns: 'repeat(auto-fill, minmax(154px, 1fr))', width: '95%' }}
      >
        {movies.map((movie) => (
          <MovieCard
            key={movie.id}
            posterImageUrl={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
            title={movie.title}
          />
        ))}
      </div>
    </TgmuScrollArea>
  );
};

export default MoviesList;
