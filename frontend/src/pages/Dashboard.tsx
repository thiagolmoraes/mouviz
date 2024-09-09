import React, { useEffect, useState } from 'react';
import MovieList from '../components/MovieList';
import Header from '../components/Header';
import "../assets/css/Dashboard.css";
import { useNavigate } from 'react-router-dom';
import { MovieListStatus } from '../services/MovieService';
import MovieService from '../services/MovieService';
import { useRefresh } from '../contexts/RefreshContext';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('PretendoAssistir');
  const [stats, setStats] = useState({ likes: 0, dislikes: 0, favorites: 0 });
  const [tabCounts, setTabCounts] = useState<MovieListStatus[]>([]);

  const { refresh, setRefresh } = useRefresh();

  const tabs = [
    { id: 'PretendoAssistir', label: 'Pretendo Assistir', count: 0 },
    { id: 'NaoAssistido', label: 'Não Assistido', count: 0 },
    { id: 'Assistido', label: 'Assistido', count: 0 },
  ];

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/add-movie');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieListStatus = await MovieService.getMovieListStatus();
        const counts = {
          likes: 0,
          dislikes: 0,
          favorites: 0,
          labels: {} as Record<string, number>
        };

        movieListStatus.forEach(movie => {
          if (movie.liked === true) counts.likes++;
          else if (movie.liked === false) counts.dislikes++;
          counts.favorites += movie.isFavorite ? 1 : 0;
          if (movie.label) counts.labels[movie.label] = (counts.labels[movie.label] || 0) + 1;
        });

        setStats({
          likes: counts.likes,
          dislikes: counts.dislikes,
          favorites: counts.favorites,
        });

        setTabCounts(movieListStatus);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setRefresh(false); // Redefine o estado refresh após a atualização dos dados
      }
    };

    if (refresh) {
      console.log('Fetching data due to refresh change'); // Log para depuração
      fetchData();
    }
  }, [refresh]); // Certifique-se de que refresh está na lista de dependências

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <h2>Meus Filmes</h2>
        <div className="user-stats">
          <span>👍 {stats.likes} </span>
          <span>👎 {stats.dislikes} </span>
          <span>⭐ {stats.favorites} </span>
        </div>
        <button className="add-movie-btn" onClick={handleButtonClick}>
          <span className="btn-icon">+</span>
          Adicionar Filme
        </button>

        <div className="tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label} ({tabCounts.filter(movie => movie.label === tab.id).length})
            </button>
          ))}
        </div>
        <div className="tab-content">
          <MovieList category={activeTab} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
