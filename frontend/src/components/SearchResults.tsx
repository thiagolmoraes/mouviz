import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MovieService, { MovieSearchResults } from '../services/MovieService';


const SearchResults = ({ query, onMovieSelect }: { query: string; onMovieSelect: (movie: MovieSearchResults) => void }) => {
  const [movies, setMovies] = useState<MovieSearchResults[]>([]);

  useEffect(() => {
    const fetchMovies = async () => {
      if (query.length > 2) {
        try {
          const results = await MovieService.getMovieList(query);
          setMovies(results.movies);
        } catch (error) {
          console.error('Error fetching movies:', error);
        }
      } else {
        setMovies([]);
      }

    };
    const debounceTimer = setTimeout(fetchMovies, 300);

    return () => clearTimeout(debounceTimer);
  }, [query]);

  return (
    <div className="search-results">
      {movies.map((movie) => (
        <div 
          key={movie.id}
          className='search-result-item'
          onClick={() => onMovieSelect(movie)}
        >
          <span>{movie.title}</span>
        </div>
      ))}
    </div>
  );
};export default SearchResults;