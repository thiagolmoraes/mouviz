import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthService from '../services/AuthService';
import "../assets/css/AuthForm.css";
import toast, { Toaster } from 'react-hot-toast';

function AuthForm({ isLogin = true }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    try {
      if (isLogin) {
        if (!email || !password) {
          toast.error('Email e senha são obrigatórios');
          return;
        }
        const response = await AuthService.login(email, password);
        if (!response || !response.name || !response.token || !response.email) {
          toast.error('Falha no login, Tente novamente novamente.');
          return;
        }
        toast.success('Login realizado com sucesso!');
        navigate("/");
      } else {
        if (password !== confirmPassword) {
          toast.error("As senhas não coincidem");
          return;
        }
        const response = await AuthService.register(name, email, password);
        toast.success('Registro realizado com sucesso!');
        navigate("/login");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(isLogin ? `Falha no login, Tente novamente novamente.` : `Falha no registro. Por favor, verifique suas informações.`);
      } else {
        toast.error(isLogin ? 'Falha no login, Tente novamente novamente.. Por favor, verifique suas credenciais.' : 'Falha no registro. Por favor, verifique suas informações.');
      }
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Mouviz System' : 'Mouviz System'}</h2>
      <h3>{isLogin ? 'Login' : 'Registrar'}</h3>
      <form className="auth-form" onSubmit={handleSubmit}>
        {!isLogin && (
          <input 
            type="text" 
            placeholder="Nome" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
        />)}
        <input 
          type="email" 
          placeholder="Email" 
          value={email} 
          onChange={(e) => setEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password} 
          onChange={(e) => setPassword(e.target.value)} 
          required 
        />
        {!isLogin && (
          <input 
            type="password" 
            placeholder="Confirmar Senha" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        )}
        <button type="submit">{isLogin ? 'Entrar' : 'Registrar'}</button>
      </form>
      <p>
        {isLogin ? "Não tem uma conta? " : "Já tem uma conta? "}
        <a href={isLogin ? '/register' : '/login'}>
          {isLogin ? 'Registre-se' : 'Entre'}
        </a>
      </p>
    </div>
  );
};

export default AuthForm;
