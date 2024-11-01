// src/components/Login/ToggleAuthMode.jsx

import React from 'react';

const ToggleAuthMode = ({ isRegistering, setIsRegistering, setError }) => {
  return (
    <p className="text-sm text-center text-gray-600 mt-4">
      {isRegistering ? '¿Ya tienes una cuenta?' : '¿No tienes cuenta?'}{' '}
      <button
        onClick={() => {
          setIsRegistering(!isRegistering);
          setError('');
        }}
        className="text-blue-600 hover:underline focus:outline-none"
      >
        {isRegistering ? 'Inicia sesión' : 'Regístrate'}
      </button>
    </p>
  );
};

export default ToggleAuthMode;
