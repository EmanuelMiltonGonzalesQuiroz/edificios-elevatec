import React from 'react';
import { FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp, FaFacebook, FaInstagram, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white text-center p-6">
      <div className="container mx-auto">
        {/* Información de contacto y ubicación */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold">Elevatec Inmobiliaria</h3>
          <p className="flex justify-center items-center mt-2">
            <FaMapMarkerAlt className="mr-2" />
            Av. Principal 123, La Paz, Bolivia
          </p>
          <p className="flex justify-center items-center mt-2">
            <FaPhoneAlt className="mr-2" />
            Teléfono: +591 60195213257
          </p>
        </div>

        {/* Redes sociales */}
        <div className="flex justify-center space-x-6 mb-4">
          <a href="https://wa.me/59160195213257" target="_blank" rel="noopener noreferrer" className="text-green-500 hover:text-green-400">
            <FaWhatsapp size={24} />
          </a>
          <a href="https://www.facebook.com/elevatecinmobiliaria" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-500">
            <FaFacebook size={24} />
          </a>
          <a href="https://www.instagram.com/elevatecinmobiliaria" target="_blank" rel="noopener noreferrer" className="text-pink-500 hover:text-pink-400">
            <FaInstagram size={24} />
          </a>
          <a href="https://www.tiktok.com/@elevatecinmobiliaria" target="_blank" rel="noopener noreferrer" className="text-black hover:text-gray-700">
            <FaTiktok size={24} />
          </a>
        </div>

        {/* Derechos reservados */}
        <p>&copy; 2024 Elevatec Inmobiliaria. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
