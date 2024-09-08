import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../services/AuthService';

const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const isAuthenticated = AuthService.isLoggedIn();

  // redireciona para a página de login se não estiver autenticado
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Se estiver autenticado, renderiza a rota normalmente
  return children;
};

export default PrivateRoute;