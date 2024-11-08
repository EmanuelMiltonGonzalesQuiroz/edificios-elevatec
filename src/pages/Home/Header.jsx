import React, { useState } from 'react';
import logo from '../../assets/images/COTA LOGO/elevatec_logo_sin_fondo.png';
import { FaBars, FaFilter, FaTimesCircle } from 'react-icons/fa';
import OpenModalButton from '../../components/UI/OpenModalButton';
import Filters from './Filters';
import MenuSidebar from './MenuSidebar'; // Importamos el nuevo componente de menú

const Header = ({ onApplyFilters, onClearFilters }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="bg-gradient-to-r from-orange-500 to-yellow-600 text-white flex justify-between items-center px-6 py-4 shadow-md">
        <div className="flex items-center space-x-4">
          <img src={logo} alt="Logo" className="w-28" />
        </div>

        {/* Botón de menú para abrir el sidebar */}
        <button
          onClick={() => setIsMenuOpen(true)}
          className="text-2xl focus:outline-none"
        >
          <FaBars />
        </button>
      </header>

      {/* Barra de filtros */}
      <div className="bg-gray-600 py-2 shadow-inner">
        <div className="container mx-auto flex justify-center gap-4">
          {/* Botón de Filtros */}
          <OpenModalButton
            icon={FaFilter}
            buttonText={<span className="md:inline">Buscar</span>}
            modalContent={(props) => (
              <Filters 
                onApplyFilters={(filters) => {
                  onApplyFilters(filters);
                  props.onClose(); // Cierra el modal después de aplicar filtros
                }}
              />
            )}
            title="Filtros de Búsqueda"
            className="flex items-center space-x-2 bg-blue-500 py-2 px-4 rounded-md hover:bg-gray-100 transition max-w-[150px]"
          />
          
          {/* Botón de Quitar Filtros */}
          <button
            onClick={onClearFilters}
            className="flex items-center space-x-2 bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500 transition max-w-[150px]"
          >
            <div className="flex items-center justify-center w-6 h-6 bg-red-500 rounded-full">
              <FaTimesCircle className="text-red text-xl" /> {/* Ajuste de color de la X */}
            </div>
            <span className="md:inline">Eliminar</span>
          </button>

        </div>
      </div>

      {/* Sidebar de menú */}
      <MenuSidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

export default Header;
