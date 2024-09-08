import React, { useEffect, useState } from 'react';
import Logo from '../assets/logo.svg';
import '../assets/css/Header.css';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';


const Header: React.FC = () => {
  const [isNavOpen, setIsNavOpen] = useState(false);
  
  const { user } = useUser();

  const navigate = useNavigate();

  
  const handleClickRedirect = () => {
    navigate('/');
  }

  return (
    <header className="header">
      <div className="header-left">
        <img src={Logo} alt="Logo" className="header-logo" />
        <h1 className="header-title" onClick={handleClickRedirect}>Mouviz</h1>
      </div>
      <div className="header-right">
        <span className="user-name" onClick={() => setIsNavOpen(!isNavOpen)}>
          {user ? user.name : "Usuário"}
        </span>
        <nav className={`header-nav ${isNavOpen ? 'open' : ''}`}>
          <ul>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
};export default Header;