// src/components/Login/GoogleButton.jsx

import React from 'react';
import { FcGoogle } from 'react-icons/fc';

const GoogleButton = ({ onClick, isRegistering }) => {
  return (
    <button
      onClick={onClick}
      className="w-full bg-white border border-gray-300 text-gray-700 py-2 rounded mt-4 hover:bg-gray-100 transition flex justify-center items-center"
    >
      <FcGoogle size={20} className="mr-2" />{' '}
      {isRegistering ? 'Regístrate' : 'Inicia Sesión'} con Google
    </button>
  );
};

export default GoogleButton;
