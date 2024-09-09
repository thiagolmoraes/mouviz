import React, { useEffect, useState, useCallback, useRef } from 'react';
import MovieCard from './MovieCard';
import '../assets/css/MovieList.css';
import MovieService, { UserListMovie, MovieCard as MovieCardType } from '../services/MovieService';
import toast from 'react-hot-toast';
import { useRefresh } from '../contexts/RefreshContext';

const MovieList: React.FC<{ category: string }> = ({ category }) => {
  const [movies, setMovies] = useState<(UserListMovie & MovieCardType)[]>([]);
  const { refresh } = useRefresh();

  const fetchMovies = useCallback(async () => {
    try {
      const movieList = await MovieService.getMovieUserList();
      const moviesWithDetails = await Promise.all(
        movieList.map(async (movie) => {
          const cardInfo = await MovieService.getCardInformation(movie.movieId);
          return { ...movie, ...cardInfo };
        })
      );
      setMovies(moviesWithDetails);
    } catch (error) {
      toast.error('Erro ao carregar filmes');
      console.error('Error fetching movies:', error);
    }
  }, []);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies, refresh]); // Adicione refresh às dependências

  const filteredMovies = movies.filter(movie => movie.label === category);

  if (filteredMovies.length === 0) {
    return <div>Nenhum filme encontrado para a categoria selecionada.</div>;
  }

  return (
    <div className="list">
      {filteredMovies.map((movie) => (
        <div key={movie.movieId}>
          <MovieCard movie={movie} />
        </div>
      ))}
    </div>
  );
};

export default MovieList;