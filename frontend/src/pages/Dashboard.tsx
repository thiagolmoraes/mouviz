import React, { useState } from 'react';
import MovieList from '../components/MovieList';
import Header from '../components/Header';
import "../assets/css/Dashboard.css";
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('PretendoAssistir');

  const tabs = [
    { id: 'PretendoAssistir', label: 'Pretende Assistir' },
    { id: 'NaoAssistido', label: 'Não Assistido' },
    { id: 'Assistido', label: 'Assistido' },
  ];

  const navigate = useNavigate();

  const handleButtonClick = () => {
    navigate('/add-movie');
  }

  return (
    <div>
      <Header />
      <div className="dashboard-container">
        <h2>Meus Filmes</h2>
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
              {tab.label}
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
