import React from 'react';
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';
import { useAuth } from '../../context/AuthContext';
import { homeText } from '../../components/common/Text/texts';
import { FaUserCircle, FaPlus, FaFilter } from 'react-icons/fa';
import OpenModalButton from '../../components/UI/OpenModalButton';
import Profile from './Profile';
import CreateAd from './CreateAd';
import Filters from './Filters';

const Header = () => {
  const { logout } = useAuth();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = user ? user.email : 'Email ';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <header className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-28" />
          <h1 className="font-semibold text-xl">Inmuebles Elevatec</h1>
        </div>
        
        <div className="flex items-center space-x-6">
          {/* Botón de perfil usando OpenModalButton */}
          <OpenModalButton
            icon={FaUserCircle}
            buttonText={userEmail}
            modalContent={Profile}
            title="Perfil de Usuario"
            className="flex items-center space-x-2"
          />

          {/* Botón para publicar anuncio usando OpenModalButton */}
          <OpenModalButton
            icon={FaPlus}
            buttonText="Publicar Anuncio"
            modalContent={CreateAd}
            title="Crear Nuevo Anuncio"
            className="flex items-center space-x-2 bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700 transition"
          />

          {/* Botón de cierre de sesión */}
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            <span>{homeText.logoutButton}</span>
          </button>
        </div>
      </header>

      {/* Sección de filtros usando OpenModalButton */}
      <div className="bg-gray-600 py-2 shadow-inner">
        <div className="container mx-auto flex justify-center">
          <OpenModalButton
            icon={FaFilter}
            buttonText="Filtros"
            modalContent={Filters}
            title="Filtros de Búsqueda"
            className="flex items-center space-x-2 text-black py-2 px-4 rounded-md bg-white hover:bg-gray-100 transition cursor-pointer"
          />
        </div>
      </div>
    </>
  );
};

export default Header;
