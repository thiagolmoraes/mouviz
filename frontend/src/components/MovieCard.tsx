import React, { useState } from 'react';
import MovieDetails from './MovieDetails';
import '../assets/css/MovieCard.css';
import { FaStar } from 'react-icons/fa';

interface MovieCardProps {
  movie: {
    movieId: number;
    title: string;
    poster_path: string;
    release_date: string;
    isFavorite: boolean;
  };
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const handleClick = () => {
    setIsDetailsOpen(true);
  };

  const handleCloseDetails = () => {
    setIsDetailsOpen(false);
  };

  return (
    <div className="card-container">
      <div className="movie-card" onClick={handleClick}>
        <div className="movie-poster">
          {movie.poster_path ? (
            <img src={movie.poster_path} alt={movie.title} className="movie-poster" />
          ) : (
            <div className="no-poster">No poster available</div>
          )}
        </div>
        <div className="movie-info">
          <div className="movie-title" title={movie.title}>{movie.title}</div>
          
          <p className="movie-year">
            {movie.release_date && !isNaN(new Date(movie.release_date).getFullYear())
              ? new Date(movie.release_date).getFullYear()
              : 'Sem Informação'}
          </p>          
          {movie.isFavorite && <FaStar className={`favorite-star ${movie.isFavorite ? 'favorite' : ''}`} />}
        </div>
      </div>
      {isDetailsOpen && (
        <div className="movie-details-modal">
          <div className="modal-header">
            <button className="close-button" onClick={handleCloseDetails}>×</button>
          </div>
          <div className="modal-content">
            <MovieDetails movie={{ id: movie.movieId }} origin="card" />
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieCard;