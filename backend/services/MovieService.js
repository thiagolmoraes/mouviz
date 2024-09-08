const Movie = require('../models/Movie');
const { MovieDb } = require('moviedb-promise');
const dotenv = require('dotenv');

if (!process.env.API_KEY) {
  throw new Error('API_KEY não está definida no arquivo .env');
}

dotenv.config();
const apiKey = process.env.API_KEY;
const moviedb = new MovieDb(apiKey);

// Definindo a allowedList para labels e status
const allowedLabels = ['PretendoAssistir', 'Assistido', 'NaoAssistido', 'Assistindo'];

class MovieService {
  static async addMovie(userId, title, label, movieId) {
    console.log("AddMove Object: ", userId, title, label, movieId);

    // Verificar se o label está na allowedList
    if (!allowedLabels.includes(label)) {
      throw new Error(`Label '${label}' não é permitido. Allowed labels: ${allowedLabels.join(', ')}`);
    }

    // Verificar duplicidade de movieId
    const existingMovieById = await Movie.findByMovieId(userId, movieId);
    if (existingMovieById) {
      throw new Error('Movie with this ID already exists for the user');
    }

    // Verificar duplicidade de title
    const existingMovies = await Movie.findAllMoviesByUser(userId);
    const existingMovieByTitle = existingMovies.find(movie => movie.title === title);
    if (existingMovieByTitle) {
      throw new Error('Movie with this title already exists for the user');
    }

    return await Movie.create(userId, title, label, movieId);
  }

  static async updateLiked(userId, movieId, like) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!movieId) {
      throw new Error('Movie ID is required');
    }

    if (typeof like !== 'boolean') {
      throw new Error('Like status is required');
    }    

    const movie = await Movie.findByMovieId(userId, movieId);
    if (!movie) {
      throw new Error('Movie not found for this user');
    }

    return await Movie.markLiked(userId, movieId, like);
  }
  
  static async updateFavorite(userId, movieId, favorite) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!movieId) {
      throw new Error('Movie ID is required');
    }

    if (typeof favorite !== 'boolean') {
      throw new Error('Favorite is required');
    }    

    const movie = await Movie.findByMovieId(userId, movieId);
    if (!movie) {
      throw new Error('Movie not found for this user');
    }

    return await Movie.markFavorite(userId, movieId, favorite);
  }

  static async getUserMovies(userId) {
    return await Movie.findAllMoviesByUser(userId);
  }

  static async getMovieList(title) {
    return await moviedb.searchMovie({ query: title, language: 'pt-BR' });
  }
  
  static async GetOneMovieByUser(userId, movieId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!movieId) {
      throw new Error('Movie ID is required');
    }

    const movie = await Movie.findByMovieId(userId, movieId);
    if (!movie) {
      throw new Error('Movie not found for this user');
    }

    return movie;
  }

  static async getUserMoviesDetails(movieId) {
    if (!movieId) {
      throw new Error('Movie ID is required');
    }

    const result = await moviedb.movieInfo({ id: movieId, append_to_response: 'credits', language: 'pt-BR' });

    if (!result) {
      throw new Error('Movie details not found');
    }

    return {
      title: result.title || 'Unknown Title',
      director: result.credits?.crew?.find(person => person.job === 'Director')?.name || 'Unknown Director',
      overview: result.overview || 'No overview available',
      runtime: result.runtime || 0,
      release_date: result.release_date ? result.release_date.split("-")[0] : 'Unknown Year',
      poster_path: result.poster_path ? `https://image.tmdb.org/t/p/w500${result.poster_path}` : null
    } 
  }

  static async updateLabelMovie(userId, movieId, label) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!movieId) {
      throw new Error('Movie ID is required');
    }

    if (!label) {
      throw new Error('Label is required');
    }

    const movie = await Movie.findByMovieId(userId, movieId);
    if (!movie) {
      throw new Error('Movie not found for this user');
    }


    if (!allowedLabels.includes(label)) {
      throw new Error('Invalid label. Allowed labels are: ' + allowedLabels.join(', '));
    }

    return await Movie.updateLabel(userId, movieId, label);
  } 
  
  static async updateRatingMovie(userId, movieId, rating) {
    if (!userId) {
      throw new Error('User ID is required');
     }

    const movie = await Movie.findByMovieId(userId, movieId);
    if (!movie) {
      throw new Error('Movie not found for this user');
    }
    

    if (!Number.isFinite(parseFloat(rating))) {
      throw new Error('Rating must be a valid float number');
    }

    if (rating < 0 || rating > 10) {
      throw new Error('Rating must be between 0 and 10');
    }

    return await Movie.updateRating(userId, movieId, rating);

  } 

  static async deleteMovie(userId, movieId) {
    if (!userId) {
      throw new Error('User ID is required');
    }

    if (!movieId) {
      throw new Error('Movie ID is required');
    }

    const movie = await Movie.findByMovieId(userId, movieId);
    if (!movie) {
      throw new Error('Movie not found for this user');
    }
    return await Movie.deleteMovieById(userId, movieId);
  }


}

module.exports = MovieService;