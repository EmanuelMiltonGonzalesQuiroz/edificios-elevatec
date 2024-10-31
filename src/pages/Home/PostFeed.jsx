import React, { useState, useEffect } from 'react';
import { db } from '../../connection/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Carousel } from 'react-responsive-carousel';
import { FaWhatsapp, FaMapMarkerAlt, FaHome, FaDollarSign } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';

const PostFeed = ({ filters }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchPublications = async () => {
      try {
        let q = query(collection(db, 'publications'), where('state', '==', 'active'));

        if (filters.transactionType) q = query(q, where('transactionType', '==', filters.transactionType));
        if (filters.rooms) q = query(q, where('rooms', '==', filters.rooms));
        if (filters.bathrooms) q = query(q, where('bathrooms', '==', filters.bathrooms));

        const querySnapshot = await getDocs(q);
        const publicationsData = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((doc) => {
            const meetsPrice =
              (!filters.priceMin || doc.amount >= filters.priceMin) &&
              (!filters.priceMax || doc.amount <= filters.priceMax);
            const meetsArea =
              (!filters.areaMin || doc.area >= filters.areaMin) &&
              (!filters.areaMax || doc.area <= filters.areaMax);
            return meetsPrice && meetsArea;
          })
          .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));

        setPublications(publicationsData);
      } catch (error) {
        console.error('Error al obtener publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [filters]);

  if (loading) return <p className="text-center text-gray-500">Cargando publicaciones...</p>;

  return (
    <div className="p-4 space-y-4">
      {publications.length === 0 ? (
        <p className="text-center text-gray-500">No hay publicaciones disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map((pub) => (
            <div key={pub.id} className="border rounded-lg p-4 shadow-lg bg-white transition-transform transform hover:scale-105 hover:shadow-2xl">
              <h3 className="text-xl font-bold mb-2 text-gray-800">{pub.name}</h3>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaDollarSign />
                <p className="text-gray-700">${pub.amount}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaMapMarkerAlt />
                <p>{pub.city}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaHome />
                <p>Tipo: {pub.transactionType}</p>
              </div>
              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <p>Área: {pub.area} m²</p>
              </div>
              <p className="text-gray-500 text-sm mb-2">Publicado el {pub.uploadedAt}</p>

              <a
                href={`https://wa.me/${pub.contact}?text=Hola, estoy interesado/a en el inmueble "${pub.name}". Descripción: ${pub.description}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center mt-3 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                <FaWhatsapp className="mr-2" /> Contactar por WhatsApp
              </a>

              {pub.imageUrls && pub.imageUrls.length > 0 && (
                <Carousel
                  showThumbs={false}
                  dynamicHeight={true}
                  infiniteLoop={true}
                  className="mt-4 max-h-60 min-h-60 rounded-lg overflow-hidden"
                  onClickItem={(index) => setSelectedImage(pub.imageUrls[index])}
                >
                  {pub.imageUrls.map((url, index) => (
                    <div key={index} className="cursor-pointer">
                      <img src={url} alt={`Imagen ${index + 1}`} className="object-cover rounded-lg max-h-60 min-h-60" />
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
          ))}
        </div>
      )}

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

export default PostFeed;
