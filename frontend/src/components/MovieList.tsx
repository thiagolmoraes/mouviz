import React, { useEffect, useState, useCallback, useRef } from 'react';
import MovieCard from './MovieCard';
import '../assets/css/MovieList.css';
import MovieService, { UserListMovie, MovieCard as MovieCardType } from '../services/MovieService';
import toast from 'react-hot-toast';

const MovieList: React.FC<{ category: string }> = ({ category }) => {
  const [movies, setMovies] = useState<(UserListMovie & MovieCardType)[]>([]);

  const fetchMovies = useCallback(async () => {
    const movieList = await MovieService.getMovieUserList();
    const moviesWithDetails = await Promise.all(
      movieList.map(async (movie) => {
        const cardInfo = await MovieService.getCardInformation(movie.movieId);
        return { ...movie, ...cardInfo };
      })
    );
    setMovies(moviesWithDetails);
  }, []);

  const promiseRef = useRef<Promise<void> | null>(null);

  useEffect(() => {
    if (!promiseRef.current) {
      promiseRef.current = toast.promise(
        fetchMovies(),
        {
          loading: 'Carregando filmes...',
          success: 'Filmes carregados com sucesso!',
          error: 'Erro ao carregar filmes',
        }
      );
    }
  }, [fetchMovies]);
  const filteredMovies = movies.filter(movie => movie.label === category);

  if (filteredMovies.length === 0) {
    return <div>Nenhum filme encontrado para a categoria selecionada.</div>;
  }

  if (movies.length === 0) {
    return <div>Você não tem nenhum filme adicionado.</div>;
  }

  return (
    <div className="list">
      {filteredMovies.map((movie) => (
        <div key={movie.movieId}>
          <MovieCard 
              movie={movie} 
              onClose={fetchMovies} 
                  
          />
        </div>
      ))}
    </div>
  );
};

export default MovieList;