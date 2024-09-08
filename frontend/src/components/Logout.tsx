import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AuthService.logout();

    navigate('/login');
  }, [navigate]);

  return (
      <></>
  );
};

export default Logout;
