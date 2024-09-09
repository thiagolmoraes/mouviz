import axios from 'axios';
import jwtDecode from 'jwt-decode';
import AuthService from '../services/AuthService';

const api = axios.create({
  baseURL: 'http://localhost:8000/movies'
})

api.interceptors.request.use(config => {
  const token = AuthService.getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

api.interceptors.response.use(response => response, async error => {
  const { response } = error;
  
  if (response && response.status == 401) {
    window.location.href = '/login';
  }

  return Promise.reject(error);
});

export interface Movie {
  id: number;
  title: string;
  movieId: number;
  director: string;
  overview: string;
  runtime: number;
  release_date: string;
  poster_path: string;
  status: string; 
}

export interface MovieCard {
  poster_path: string;
  isFavorite: boolean;
  release_date: string;
}

export interface MovieSearchResults {
    id: number,
    title: string;
}

export interface UserListMovie {
  movieId: number;
  title: string;
  label: string;
}

export interface MovieListStatus {
  liked: boolean | null;
  isFavorite: boolean;
  label: string
}

export interface MovieStatus {
  rating: number | null;
  isFavorite: boolean;
  liked: boolean | null;
  label: string;
}

class MovieService {
  getUserStats() {
    throw new Error('Method not implemented.');
  }

  async getMovieListStatus(): Promise<MovieListStatus[]> {
    const response = await api.get<MovieListStatus[]>('/user');
    return response.data.map(item => ({
      liked: item.liked,
      isFavorite: item.isFavorite,
      label: item.label,
    }));
  }

  async getCardInformation(movieId: number): Promise<MovieCard> {
    try {
      const [movieDetails, userStatus] = await Promise.all([
        api.get<Movie>(`/${movieId}/details`),
        api.get<MovieStatus>(`/${movieId}/user`)
      ]);
  
      return {
        poster_path: movieDetails.data.poster_path,
        release_date: movieDetails.data.release_date,
        isFavorite: userStatus.data.isFavorite,
      };
    } catch (error) {
      console.error('Erro ao buscar o filme:', error);
      throw error;
    }
  }

  
  async getMovieUserList(): Promise<UserListMovie[]> {
    const response = await api.get<UserListMovie[]>('/user');
    return response.data;
  }

  async deleteMovieFromList(movieId: number): Promise<void> {
    try {
      const test = await api.delete(`/${movieId}/delete`);
      console.log(test);
    } catch (error) {
      console.error('Erro ao excluir o filme:', error);
      throw error;
    }
  }
  
  async getMovieStatus(movieId: number): Promise<MovieStatus> {
    const response = await api.get<MovieStatus>(`/${movieId}/user`);
    return response.data;
  }

  async getMovieList(title: string): Promise<{ movies: MovieSearchResults[] }> {
    const response = await api.get(`/search/${title}`);
    return response.data;
  }
  
  async addMovie(movieId: number, label: string, title: string): Promise<Movie> {
    try {
        const response = await api.post<Movie>('/add', {movieId, label, title});
        return response.data;
    } catch (error) {
        console.error('Erro ao adicionar o filme:', error);
        throw error;
    }
  }

  // Buscar um filme   
  async getMovieById(id: number): Promise<Movie> {
    try {
      const response = await api.get<Movie>(`/${id}/details`);
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar o filme:', error);
      throw error;
    }
  }

  async updateMovieRating(movieId: number, rating: number): Promise<boolean> {
    try {
      const response = await api.post(`/${movieId}/rating`, { rating });
      return response.data.message === 'Rating updated successfully' || response.status === 200;
    } catch (error) {
      console.error('Erro ao atualizar a classificação do filme:', error);
      return false;
    }
  }
  async updateMovieLabel(movieId: number, label: string): Promise<boolean> {
    try {
      const response = await api.post(`/${movieId}/label`, { label });
      return response.data.message === 'Label updated successfully' || response.status === 200;
    } catch (error) {
      console.error('Erro ao atualizar o rótulo do filme:', error);
      return false;
    } 
  }


  async updateMovieFavorite(movieId: number, favorite: boolean): Promise<boolean> {
    try {
      const response = await api.post(`/${movieId}/favorite`, { favorite });
      return response.data.message === 'Favorite updated successfully' || response.status === 200;
    } catch (error) {
      console.error('Erro ao favoritar um filme:', error);
      return false;
    } 
  }

  async updateMovieLiked(movieId: number, like: boolean): Promise<boolean> {
    try {
      const response = await api.post(`/${movieId}/liked`, { like });
      return response.data.message === 'Like updated successfully' || response.status === 200;
    } catch (error) {
      console.error('Erro ao avaliar um filme:', error);
      return false;
    }
  }
}

export default new MovieService();
