import * as ScrollArea from '@radix-ui/react-scroll-area';
import { Movie } from 'shared-types';
import MovieCard from './movie-card';
import './movies-list.scss';

interface MoviesListProps {
  movies: Movie[];
}

const MoviesList: React.FC<MoviesListProps> = ({ movies }: MoviesListProps) => {
  return (
    <ScrollArea.Root className="ScrollAreaRoot">
      <ScrollArea.Viewport className="ScrollAreaViewport">
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
      </ScrollArea.Viewport>
      <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="vertical">
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Scrollbar className="ScrollAreaScrollbar" orientation="horizontal">
        <ScrollArea.Thumb className="ScrollAreaThumb" />
      </ScrollArea.Scrollbar>
      <ScrollArea.Corner className="ScrollAreaCorner" />
    </ScrollArea.Root>
  );
};

export default MoviesList;
