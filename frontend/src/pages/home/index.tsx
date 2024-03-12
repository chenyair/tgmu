import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { movieService } from '@/services/movie-service';
import MoviesList from './components/movies-list';

const HomePage: React.FC = () => {
  const { data, error, status } = useQuery({
    queryKey: ['popularMovies'],
    refetchOnWindowFocus: false,
    refetchOnMount: false,
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

        return MoviesList({ movies: data });
      })()}
      )
    </div>
  );
};

export default HomePage;
