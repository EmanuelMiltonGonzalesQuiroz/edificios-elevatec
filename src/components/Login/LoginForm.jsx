// src/components/Login/LoginForm.jsx

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import LoginFields from './LoginFields';
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';
import {
  checkUserExists,
  registerUser,
  loginWithGoogle,
  registerWithGoogle,
  checkUserExistsByUID,
} from '../../services/auth';
import GoogleButton from './GoogleButton';
import ToggleAuthMode from './ToggleAuthMode';
import fondo from '../../assets/images/fondo.jpg'; // Importar la imagen de fondo

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleLogin = async () => {
    setError('');
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    try {
      const userData = await checkUserExists(email);
      if (userData) {
        if (userData.state === 'inactive') {
          setError('Su cuenta ha sido deshabilitada.');
          return;
        }
        if (userData.password === password) {
          login(userData);
          window.location.href = '/';
        } else {
          setError('Contraseña incorrecta.');
        }
      } else {
        setError('El usuario no está registrado. Por favor regístrate.');
      }
    } catch (error) {
      setError('Error al iniciar sesión.');
    }
  };

  const handleRegister = async () => {
    setError('');
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    try {
      const userData = await checkUserExists(email);
      if (userData) {
        setError('Este correo ya está registrado. Inicia sesión en su lugar.');
        return;
      }
      const newUserData = await registerUser(email, password);
      login(newUserData);
      window.location.href = '/';
    } catch (error) {
      setError('Error al registrarse.');
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    try {
      const user = await loginWithGoogle();
      const userData = await checkUserExistsByUID(user.uid);
      if (userData) {
        if (userData.state === 'inactive') {
          setError('Su cuenta ha sido deshabilitada.');
          return;
        }
        login(userData);
        window.location.href = '/';
      } else {
        setError('El usuario no está registrado. Por favor regístrate.');
      }
    } catch (error) {
      setError(error.message || 'Error al iniciar sesión con Google.');
    }
  };

  const handleGoogleRegister = async () => {
    setError('');
    try {
      const user = await loginWithGoogle();
      const userExists = await checkUserExistsByUID(user.uid);
      if (userExists) {
        setError('Este correo ya está registrado. Inicia sesión en su lugar.');
        return;
      }
      const newUserData = await registerWithGoogle(user);
      login(newUserData);
      window.location.href = '/';
    } catch (error) {
      setError('Error al registrarse con Google.');
    }
  };
 
  return (
    <div
    className="flex items-center justify-center h-screen"
    style={{
        backgroundImage: `url(${fondo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Logo" className="h-16" />
        </div>
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          {isRegistering ? 'Regístrate' : 'Inicia Sesión'}
        </h2>
        <LoginFields
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          handleSubmit={isRegistering ? handleRegister : handleLogin}
          isRegistering={isRegistering}
        />
        <GoogleButton
          onClick={isRegistering ? handleGoogleRegister : handleGoogleLogin}
          isRegistering={isRegistering}
        />
        <ToggleAuthMode
          isRegistering={isRegistering}
          setIsRegistering={setIsRegistering}
          setError={setError}
        />
        {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
      </div>
    </div>
  );
};

export default LoginForm;
