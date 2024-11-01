import React from 'react';
import { FaUserCircle, FaPlus, FaSignOutAlt } from 'react-icons/fa';
import OpenModalButton from '../../components/UI/OpenModalButton';
import Profile from './Profile';
import CreateAd from './CreateAd';
import { useAuth } from '../../context/AuthContext';
import { homeText } from '../../components/common/Text/texts';

const MenuSidebar = ({ isOpen, onClose }) => {
  const { logout, currentUser } = useAuth();

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  const handleProfileClick = () => {
    if (!currentUser) {
      window.location.href = '/login';
    }
  };

  return (
    <div
      className={`fixed inset-y-0 right-0 max-w-60 bg-white text-black shadow-2xl transform ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 z-50`}
    >
      <button onClick={onClose} className="text-gray-600 text-3xl p-4 hover:text-gray-900">
        &times;
      </button>
      <div className="p-6 space-y-4">
        {/* Botón de Perfil */}
        <div onClick={handleProfileClick}>
          <OpenModalButton
            icon={FaUserCircle}
            buttonText="Perfil"
            modalContent={currentUser ? Profile : null}
            title="Perfil de Usuario"
            className="flex items-center space-x-3 text-white bg-gray-500 hover:bg-gray-600 p-3 rounded-lg w-full text-base font-medium shadow-md hover:shadow-lg transition"
          />
        </div>

        {/* Botón Publicar Anuncio */}
        <OpenModalButton
          icon={FaPlus}
          buttonText="Publicar Anuncio"
          modalContent={CreateAd}
          title="Crear Nuevo Anuncio"
          className="flex items-center space-x-3 text-white bg-gradient-to-r from-blue-500 to-blue-700 hover:bg-blue-800 p-3 rounded-lg w-full text-base font-medium shadow-md hover:shadow-lg transition"
        />

        {/* Botón de Cerrar Sesión (solo si el usuario está autenticado) */}
        {currentUser && (
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 text-white bg-gradient-to-r from-red-500 to-red-700 hover:bg-red-800 p-3 rounded-lg w-full text-base font-medium shadow-md hover:shadow-lg transition"
          >
            <FaSignOutAlt />
            <span>{homeText.logoutButton}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default MenuSidebar;