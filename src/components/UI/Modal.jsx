import React from 'react';
import { FaTimes } from 'react-icons/fa';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-60 flex justify-center items-center text-black  z-50">
      <div className="bg-white rounded-lg overflow-auto max-h-[90vh] max-w-[90vw]  p-6 relative shadow-lg">
        {/* Header con título y botón de cerrar */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <button
            onClick={onClose}
            className="bg-red-600 p-2 rounded-full text-white hover:bg-red-700 transition"
          >
            <FaTimes size={16} />
          </button>
        </div>
        
        {/* Contenido del modal */}
        <div className="mb-4">
          {children}
        </div>

        {/* Botón de Cancelar */}
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
