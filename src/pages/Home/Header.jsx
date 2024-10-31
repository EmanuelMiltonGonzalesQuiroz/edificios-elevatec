import React from 'react';
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';
import { useAuth } from '../../context/AuthContext';
import { homeText } from '../../components/common/Text/texts';
import { FaUserCircle, FaPlus, FaFilter, FaTimesCircle, FaSignOutAlt } from 'react-icons/fa'; // Importamos el icono de cerrar sesión
import OpenModalButton from '../../components/UI/OpenModalButton';
import Profile from './Profile';
import CreateAd from './CreateAd';
import Filters from './Filters';

const Header = ({ onApplyFilters, onClearFilters }) => {
  const { logout } = useAuth();
  const storedUser = localStorage.getItem('user');
  const user = storedUser ? JSON.parse(storedUser) : null;
  const userEmail = user ? user.email : 'Email';

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <header className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white flex justify-between items-center px-6 py-4 shadow-md overflow-auto">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-28" />
        </div>
        
        <div className="flex items-center space-x-4">
          <OpenModalButton
            icon={FaUserCircle}
            buttonText={<span className="hidden md:inline">{userEmail}</span>} // Solo muestra texto en md o superior
            modalContent={Profile}
            title="Perfil de Usuario"
            className="flex items-center space-x-2"
          />

          <OpenModalButton
            icon={FaPlus}
            buttonText={<span className="hidden md:inline">Publicar Anuncio</span>}
            modalContent={CreateAd}
            title="Crear Nuevo Anuncio"
            className="flex items-center space-x-2 bg-blue-600 py-2 px-4 rounded-md hover:bg-blue-700 transition"
          />

          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition"
          >
            <FaSignOutAlt />
            <span className="hidden md:inline">{homeText.logoutButton}</span> {/* Solo muestra texto en md o superior */}
          </button>
        </div>
      </header>

      <div className="bg-gray-600 py-2 shadow-inner">
        <div className="container mx-auto flex justify-center gap-4">
          <OpenModalButton
            icon={FaFilter}
            buttonText={<span className="hidden md:inline">Filtros</span>}
            modalContent={() => <Filters onApplyFilters={onApplyFilters} />}
            title="Filtros de Búsqueda"
            className="flex items-center space-x-2 bg-white text-black py-2 px-4 rounded-md hover:bg-gray-100 transition"
          />
          
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition"
          >
            <FaTimesCircle />
            <span className="hidden md:inline">Quitar Filtros</span> {/* Solo muestra texto en md o superior */}
          </button>
        </div>
      </div>
    </>
  );
};

export default Header;
