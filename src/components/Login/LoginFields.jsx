import React, { useRef } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { MdAttachEmail } from 'react-icons/md';

const LoginFields = ({
  email,
  setEmail,
  password,
  setPassword,
  handleSubmit,
  isRegistering,
}) => {
  const [showPassword, setShowPassword] = React.useState(false);
  const passwordInputRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <>
      <div className="mb-4 relative">
        <label
          htmlFor="email"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Correo Electrónico
        </label>
        <div className="flex items-center border rounded overflow-hidden">
          <MdAttachEmail className="text-gray-500 ml-3" size={24} />
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Ingrese su correo"
            className="flex-1 p-3 bg-transparent text-black focus:outline-none"
            onKeyDown={handleKeyDown}
          />
        </div>
      </div>
      <div className="mb-4 relative">
        <label
          htmlFor="password"
          className="block text-gray-700 text-sm font-semibold mb-2"
        >
          Contraseña
        </label>
        <div className="flex items-center border rounded overflow-hidden">
          <input
            type={showPassword ? 'text' : 'password'}
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingrese su contraseña"
            className="flex-1 p-3 bg-transparent text-black focus:outline-none"
            ref={passwordInputRef}
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="mr-3 text-gray-600 focus:outline-none"
          >
            {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
          </button>
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
      >
        {isRegistering ? 'Registrarse' : 'Iniciar Sesión'}
      </button>
    </>
  );
};

export default LoginFields;
