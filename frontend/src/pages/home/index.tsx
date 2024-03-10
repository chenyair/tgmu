import React from 'react';
import MovieCard from './components/movie-card';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '@/services/movie-service';

const HomePage: React.FC = () => {
  const { data, error, status } = useQuery({
    queryKey: ['popularMovies'],
    refetchOnWindowFocus: false,
    queryFn: ({ signal }) => movieService.getPopular(signal),
  });

  return (
    <div className="d-flex justify-content-center align-items-center h-100">
      {(() => {
        if (status === 'pending') {
          return <div>Loading...</div>;
        }

        if (status === 'error') {
          return <div>Error</div>;
        }

        return (
          <div className="d-flex justify-content-center align-items-center flex-wrap gap-3" style={{ width: '60%' }}>
            {data.map((movie) => (
              <MovieCard
                key={movie.id}
                posterImageUrl={`https://image.tmdb.org/t/p/w154${movie.poster_path}`}
                title={movie.title}
              />
            ))}
          </div>
        );
      })()}
      )
    </div>
  );
};

export default HomePage;
