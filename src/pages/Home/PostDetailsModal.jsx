import React, { useState } from 'react';
import { Carousel } from 'react-responsive-carousel';
import { FaWhatsapp, FaMapMarkerAlt, FaHome, FaDollarSign, FaRuler, FaBed, FaBath, FaMap } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const PostDetailsModal = ({ publication, onClose }) => {
  const whatsappUrl = `https://wa.me/${publication.contact}?text=Hola, estoy interesado/a en el inmueble "${publication.name}". Descripción: ${publication.description}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${publication.latitude},${publication.longitude}`;
  const [selectedImage, setSelectedImage] = useState(null);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-5xl w-full flex relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600 text-2xl">&times;</button>

        {/* Detalles (1/4 de ancho) */}
        <div className="w-1/4 p-4 space-y-4 text-left">
          <h3 className="text-2xl font-bold mb-4 text-gray-800">{publication.name}</h3>

          <div className="space-y-2">
            <div className="flex items-center space-x-2 text-gray-600">
              <FaDollarSign />
              <p className="text-gray-700">${publication.amount}</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaMapMarkerAlt />
              <p>{publication.city}</p>
            </div>
            <div className="flex items-center space-x-2 text-gray-600">
              <FaHome />
              <p>Tipo: {publication.transactionType}</p>
            </div>
            {publication.area && (
              <div className="flex items-center space-x-2 text-gray-600">
                <FaRuler />
                <p>Área: {publication.area} m²</p>
              </div>
            )}
            {publication.rooms && (
              <div className="flex items-center space-x-2 text-gray-600">
                <FaBed />
                <p>Habitaciones: {publication.rooms}</p>
              </div>
            )}
            {publication.bathrooms && (
              <div className="flex items-center space-x-2 text-gray-600">
                <FaBath />
                <p>Baños: {publication.bathrooms}</p>
              </div>
            )}
            {publication.description && (
              <div className="text-gray-600">
                <p>Descripción: {publication.description}</p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex flex-col space-y-2 mt-4">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
            >
              <FaWhatsapp className="mr-2" /> WhatsApp
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
            >
              <FaMap className="mr-2" /> Ver en Maps
            </a>
          </div>
        </div>

        {/* Carrusel de Imágenes (3/4 de ancho) */}
        <div className="w-3/4 p-4">
          <Carousel
            showThumbs={false}
            showIndicators={false}
            showStatus={false}
            dynamicHeight={false} 
            infiniteLoop={true}
            className="rounded-lg overflow-hidden"
          >
            {publication.imageUrls.map((url, index) => (
              <div key={index} onClick={() => setSelectedImage(url)} className="w-full h-[400px]">
                <img src={url} alt={`Imagen de la publicación`} className="object-cover w-full h-full" />
              </div>
            ))}
          </Carousel>
        </div>
      </div>

      {/* Modal de Imagen Ampliada */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50" onClick={() => setSelectedImage(null)}>
          <div className="max-w-3xl w-full p-4 relative">
            <button onClick={() => setSelectedImage(null)} className="absolute top-2 right-2 text-white text-3xl">
              &times;
            </button>
            <img src={selectedImage} alt="Imagen ampliada" className="object-cover rounded-lg max-h-[80vh] w-full shadow-lg" />
          </div>
        </div>
      )}
    </div>
  );
};

export default PostDetailsModal;
