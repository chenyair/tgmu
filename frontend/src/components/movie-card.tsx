import React from 'react';
import './movie-card.scss';

interface MovieCardProps {
  // https://image.tmdb.org/t/p/w185/95VlSEfLMqeX36UVcHJuNlWEpwf.jpg
  posterImageUrl: string;
  title: string;
  height?: string;
  width?: string;
  className?: string;
  border?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({
  title,
  posterImageUrl,
  height = '100%',
  width = '100%',
  border = 'none',
  className,
}: MovieCardProps) => {
  return (
    <div className={`movie-card ${className || ''}`}>
      <img src={posterImageUrl} alt={`${title}-card`} className="movie-poster" style={{ height, width, border }} />
    </div>
  );
};

export default MovieCard;
