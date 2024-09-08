import React from 'react';
import { Link } from 'react-router-dom';
import ErrorLogo from '../assets/error.jpg'

const ErrorPage = () => {
  return (
    <div style={{
        backgroundImage: `url(${ErrorLogo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
        width: '100vw',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
    </div>
  );
};

export default ErrorPage;
