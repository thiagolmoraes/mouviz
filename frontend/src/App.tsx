import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RefreshProvider } from './contexts/RefreshContext';
import AuthForm from './components/AuthForm';
import Dashboard from './pages/Dashboard';
import MovieSearch from './pages/MovieSearch';
import ErrorPage from './pages/ErrorPage';
import Logout from './components/Logout';
import { Toaster } from 'react-hot-toast';
import PrivateRoute from './components/PrivateRoute';
import { UserProvider } from './contexts/UserContext';

function App() {
  return (
      <RefreshProvider>
      <UserProvider>
        <Router>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
            }}
          />
          <div className="App">
            <Routes>
              <Route path="/login" element={<AuthForm isLogin={true} />} />
              <Route path="/register" element={<AuthForm isLogin={false} />} />
              <Route path="/" element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              } />
              <Route path="/add-movie" element={
                <PrivateRoute>
                  <MovieSearch />
                </PrivateRoute>
              } />
              <Route path="/logout" element={<Logout />} />
              <Route path="*" element={<ErrorPage />} />
            </Routes>
          </div>
        </Router>
        </UserProvider>
      </RefreshProvider>
  );
}

export default App;