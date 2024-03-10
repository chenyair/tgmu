import React from 'react';
import './movie-card.scss';

interface MovieCardProps {
  // https://image.tmdb.org/t/p/w185/95VlSEfLMqeX36UVcHJuNlWEpwf.jpg
  posterImageUrl: string;
  title: string;
  className?: string;
}

const MovieCard: React.FC<MovieCardProps> = ({ title, posterImageUrl, className }: MovieCardProps) => {
  return (
    <div className={`movie-card ${className || ''}`}>
      <img src={posterImageUrl} alt={`${title}-card`} className="movie-poster" />
    </div>
  );
};

export default MovieCard;
