import React, { useEffect, useState } from 'react';
import MovieService, { Movie } from '../services/MovieService';
import '../assets/css/MovieDetails.css';
import { FaStar, FaThumbsUp, FaThumbsDown } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useRefresh } from '../contexts/RefreshContext';

interface MovieDetailsProps {
  movie: { id: number };
  origin?: 'search' | 'card';
  onClose?: () => void;
}

const MovieDetails: React.FC<MovieDetailsProps> = ({ movie, origin = 'search', onClose }) => {
  const [details, setDetails] = useState<Movie | null>(null);
  const [label, setLabel] = useState<string>('PretendoAssistir');
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const [userRating, setUserRating] = useState<number | null>(null);
  const { setRefresh } = useRefresh();

  const showMessage = (msg: string, type: 'success' | 'error' = 'success') => {
    if (type === 'success') {
      toast.success(msg);
    } else {
      toast.error(msg);
    }
  };

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDetails = await MovieService.getMovieById(movie.id);
        setDetails(movieDetails);
        
        if (origin === 'card'){
          const movieStatus = await MovieService.getMovieStatus(movie.id);
          setLabel(movieStatus.label);
          setIsFavorite(movieStatus.isFavorite);
          setIsLiked(movieStatus.liked === true);
          setIsDisliked(movieStatus.liked === false);
          setUserRating(movieStatus.rating);
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      }
    };

    fetchMovieDetails();
  }, [movie.id, origin]);

  const handleAction = async (action: () => Promise<void>) => {
    try {
      await action();
      setRefresh(true);
    } catch (error) {
      console.error('Error performing action:', error);
      showMessage('An error occurred', 'error');
    }
  };

  const handleFavoriteClick = () => handleAction(async () => {
    const success = await MovieService.updateMovieFavorite(movie.id, !isFavorite);
    if (success) {
      setIsFavorite(!isFavorite);
      showMessage(!isFavorite ? 'Filme adicionado aos favoritos.' : 'Filme removido dos favoritos.');
    } else {
      throw new Error('Não foi possível atualizar o status de favorito.');
    }
  });



  const handleLikeClick  = () => handleAction(async () => {
    try {
      const success = await MovieService.updateMovieLiked(movie.id, true);
      if (success) {
        setIsLiked(true);
        setIsDisliked(false);
        showMessage('Você gostou do filme!');
      } else {
        throw new Error('Não foi possível curtir o filme.');
      }
    } catch (error) {
      console.error('Error updating like status:', error);
      showMessage('Erro ao curtir o filme.', 'error');
    }
  });

  const handleDislikeClick  = () => handleAction(async () => {
    try {
      const success = await MovieService.updateMovieLiked(movie.id, false);
      if (success) {
        setIsLiked(false);
        setIsDisliked(true);
        showMessage('Você não gostou do filme.');
      } else {
        throw new Error('Não foi possível descurtir o filme.');
      }
    } catch (error) {
      console.error('Error updating dislike status:', error);
      showMessage('Erro ao descurtir o filme.', 'error');
    }
  });

  const handleAddItem = () => handleAction(async () => {
    if (details) {
      await MovieService.addMovie(movie.id, label, details.title);
      showMessage('Filme adicionado à lista.');
    }
  });

  const handleRatingChange = (e: React.ChangeEvent<HTMLSelectElement>) => handleAction(async () => {
    const newRating = parseInt(e.target.value);
    setUserRating(newRating);
    const success = await MovieService.updateMovieRating(movie.id, newRating);
    if (success) {
      showMessage('Avaliação atualizada com sucesso.');
    } else {
      throw new Error('Não foi possível atualizar a avaliação.');
    }
  });

  const handleRemoveItem = () => handleAction(async () => {
    await MovieService.deleteMovieFromList(movie.id);
    showMessage('Filme removido da lista.');
    if (onClose) onClose();
  });

  const handleLabelChange = (e: React.ChangeEvent<HTMLSelectElement>) => handleAction(async () => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    const success = await MovieService.updateMovieLabel(movie.id, newLabel);
    if (success) {
      showMessage('Rótulo atualizado com sucesso.');
    } else {
      throw new Error('Não foi possível atualizar o rótulo.');
    }
  });

  if (!details) {
    return <div>Loading...</div>;
  }

  return (
    <div className="content-details">
      <div className="poster-container">
        {details.poster_path ? (
          <img src={details.poster_path} alt={details.title} />
        ) : (
          <div className="no-poster">No poster available</div>
        )}
      </div>
      <div className="info-container">
        <h2>{details.title}</h2>
        <p><strong>Sinopse:</strong> {details.overview}</p>
        <p><strong>Tempo de Duração:</strong> {details.runtime} minutos</p>
        <p><strong>Lançamento:</strong> {details.release_date}</p>
        <p><strong>Diretor:</strong> {details.director}</p>
        <div className='action-container'>
          {origin === 'card' && (
            <div>
              <FaStar
                className={`favorite-icon ${isFavorite ? 'favorite' : ''}`}
                onClick={handleFavoriteClick}
              />
              {isLiked ? (
                <FaThumbsUp className="thumb active" onClick={handleLikeClick} />
              ) : (
                <FaThumbsUp className="thumb" onClick={handleLikeClick} />
              )}
              {isDisliked ? (
                <FaThumbsDown className="thumb active" onClick={handleDislikeClick} />
              ) : (
                <FaThumbsDown className="thumb" onClick={handleDislikeClick} />
              )}
              <select
                value={userRating || ''}
                onChange={handleRatingChange}
                className=" -select"
              >
                <option value="">Rate</option>
                {[...Array(11)].map((_, i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </select>

            <select value={label} onChange={handleLabelChange} className='custom-select'>
              <option value="PretendoAssistir">Pretendo Assistir</option>
              <option value="NaoAssistido">Não Assistido</option>
              <option value="Assistido">Assistido</option>
            </select>

            <button className='button-add-item' onClick={handleRemoveItem}>
              Remover filme da Lista
            </button>

            </div>
          )}
          {origin === 'search' && (
            <button onClick={handleAddItem} className='button-add-item'>Adicionar à Minha Lista</button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;