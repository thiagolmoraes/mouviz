import React, { useState } from 'react';
import SearchResults from "../components/SearchResults";
import Header from '../components/Header';
import MovieDetails from '../components/MovieDetails';

import '../assets/css/SearchResults.css';

const MovieSearch = () => {
  const [query, setQuery] = useState('');
  const [selectMovie, setSelectMovie] = useState(null);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleMovieSelect = (movie: any) => {
    setSelectMovie(movie);
    setQuery('');
  };

  return (
    <div>
      <Header />
      <div className="movie-search-container">
        <input
          type="text"
          placeholder="Pesquisar filmes..."
          value={query}
          onChange={handleSearch}
          className="search-bar"
        />
        <SearchResults query={query} onMovieSelect={handleMovieSelect} />
        {selectMovie && <MovieDetails movie={selectMovie} origin="search" />}
      </div>
    </div>
  );
};

export default MovieSearch;