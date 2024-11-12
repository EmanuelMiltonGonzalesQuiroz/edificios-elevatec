import React, { useState, useEffect  } from 'react';
import ReactDOM from 'react-dom';
import { Carousel } from 'react-responsive-carousel';
import { FaWhatsapp, FaMapMarkerAlt, FaHome, FaDollarSign, FaRuler, FaBed, FaBath, FaMap, FaMapSigns, FaBuilding, FaTimes, FaHeart } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import EditButton from '../../components/UI/EditButton';
import DeleteButton from '../../components/UI/DeleteButton';
import DisableButton from '../../components/UI/DisableButton';
import EnableButton from '../../components/UI/EnableButton';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../connection/firebase';
import { doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';

const PostDetailsModal = ({ publication, onClose, onUpdatePublication, onDeletePublication }) => {
  const { currentUser } = useAuth();
  const [selectedImage, setSelectedImage] = useState(null);
  const [viewers, setViewers] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);

  const whatsappUrl = `https://wa.me/${publication.contact}?text=Hola, estoy interesado/a en el inmueble "${publication.name}". Descripción: ${publication.description}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(publication.latitude)},${encodeURIComponent(publication.longitude)}`;

  const currencySymbol = publication.currency === 'USD' ? '$' : 'Bs';

  const editFieldsConfig = [
    { label: 'Nombre', name: 'name', type: 'input', editable: true, validation: /^[a-zA-Z\s]+$/ },
    { label: 'Descripción', name: 'description', type: 'textarea', editable: true },
    { label: 'Monto', name: 'amount', type: 'input', editable: true, validation: /^[0-9]+$/ },
    { label: 'Ciudad', name: 'city', type: 'input', editable: true },
    { label: 'Área', name: 'area', type: 'input', editable: true, validation: /^[0-9]+$/ },
    { label: 'Habitaciones', name: 'rooms', type: 'input', editable: true, validation: /^[0-9]+$/ },
    { label: 'Baños', name: 'bathrooms', type: 'input', editable: true, validation: /^[0-9]+$/ },
    { label: 'Tipo de Transacción', name: 'transactionType', type: 'select', options: ['preventa', 'venta', 'alquiler'], editable: true },
    { label: 'Dirección', name: 'address', type: 'input', editable: true },
    { label: 'Tipo de Lugar', name: 'placeType', type: 'select', options: ['departamento', 'edificio', 'casa', 'local', 'oficina'], editable: true },
  ];
  useEffect(() => {
    const fetchViewers = async () => {
      const viewerData = await Promise.all(
        publication.views.map(async (viewerId) => {
          const viewerRef = doc(db, 'users', viewerId);
          const viewerSnap = await getDoc(viewerRef);
          return viewerSnap.exists() ? viewerSnap.data() : { id: viewerId, username: 'Usuario desconocido' };
        })
      );
      setViewers(viewerData);
    };

    if (publication.views && publication.views.length > 0) {
      fetchViewers();
      // Verificar si el usuario actual ya es un "favorito"
      setIsFavorite(publication.views.includes(currentUser?.uid));
    }
  }, [publication.views, currentUser?.uid]);
  const handleAddToFavorites = async () => {
    if (!currentUser) return;

    const publicationRef = doc(db, 'publications', publication.id);
    try {
      await updateDoc(publicationRef, {
        views: arrayUnion(currentUser.uid),
      });
      setIsFavorite(true);
      setViewers((prevViewers) => [...prevViewers, { id: currentUser.uid, username: currentUser.username }]);
    } catch (error) {
      console.error('Error al añadir a favoritos:', error);
    }
  };

  return ReactDOM.createPortal (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-3xl w-full flex flex-col space-y-4 relative max-h-[90vh] ">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-red-500 p-2 rounded-full text-white hover:bg-red-600 transition"
        >
          <FaTimes size={16} />
        </button>

        <h3 className="text-3xl font-bold text-gray-800 text-center">{publication.name}</h3>

        {/* Contenedor para los detalles y el carrusel en una sola columna */}
        <div className="flex flex-col space-y-6 overflow-auto">
          
          {/* Detalles de la publicación */}
          <div className="space-y-2 text-gray-600 text-lg">
            <div className="flex items-center space-x-2">
              <FaDollarSign className="text-gray-700" />
              <p className="text-gray-700 font-semibold">{currencySymbol}{publication.amount}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapMarkerAlt className="text-gray-700" />
              <p>{publication.city}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaBuilding className="text-gray-700" />
              <p>{publication.placeType}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaMapSigns className="text-gray-700" />
              <p>Dirección: {publication.address}</p>
            </div>
            <div className="flex items-center space-x-2">
              <FaHome className="text-gray-700" />
              <p>{publication.transactionType}</p>
            </div>
            {publication.area && (
              <div className="flex items-center space-x-2">
                <FaRuler className="text-gray-700" />
                <p>Área: {publication.area} m²</p>
              </div>
            )}
            {publication.rooms && (
              <div className="flex items-center space-x-2">
                <FaBed className="text-gray-700" />
                <p>Habitaciones: {publication.rooms}</p>
              </div>
            )}
            {publication.bathrooms && (
              <div className="flex items-center space-x-2">
                <FaBath className="text-gray-700" />
                <p>Baños: {publication.bathrooms}</p>
              </div>
            )}
          </div>

          {/* Carrusel de Imágenes */}
          <div className="w-full">
            <Carousel showThumbs={false} showIndicators={false} showStatus={false} infiniteLoop={true} className="rounded-lg overflow-hidden">
              {publication.imageUrls?.map((url, index) => (
                <div key={index} onClick={() => setSelectedImage(url)} className="w-full h-[400px]">
                  <img src={url} alt={`Imagen de la publicación`} className="object-cover w-full h-full" />
                </div>
              ))}
            </Carousel>
          </div>

          {/* Descripción */}
          <div className="text-gray-700 text-lg">
            <h4 className="font-semibold">Descripción:</h4>
            <p>{publication.description}</p>
          </div>

          {/* Botones de acción (Editar, Habilitar/Inhabilitar, Eliminar) */}
          {(currentUser?.role === 'Administrador' || currentUser?.uid === publication.uploadedBy) && (
            <div>
              <div className="flex space-x-4 mt-4">
                <EditButton 
                  row={publication} 
                  fieldsConfig={editFieldsConfig} 
                  collectionName="publications"
                  onUpdateSuccess={onUpdatePublication}
                />
                {publication.state !== 'inactive' ? (
                  <DisableButton
                    row={publication}
                    collectionName="publications"
                    onDisableSuccess={(id) => {
                      if (onUpdatePublication) onUpdatePublication({ ...publication, state: 'inactive' });
                    }}
                  />
                ) : (
                  <EnableButton
                    row={publication}
                    collectionName="publications"
                    onEnableSuccess={(id) => {
                      if (onUpdatePublication) onUpdatePublication({ ...publication, state: 'active' });
                    }}
                  />
                )}
                <DeleteButton 
                  row={publication}
                  collectionName="publications"
                  onDeleteSuccess={onDeletePublication}
                />
                
              </div>
              <div className="mt-6">
            <h4 className="font-semibold text-gray-800">Personas que vieron el anuncio:</h4>
            <div className="flex flex-col space-y-2 mt-2">
              {publication.views?.map((viewer) => (
                <div key={viewer} className="flex items-center justify-between bg-gray-100 p-2 rounded-lg">
                  <span className="text-gray-800">{viewer}</span>
                  <a
                    href={`https://wa.me/${publication.contact}?text=Hola ${viewer}, al parecer estás interesado/a en el anuncio: ${publication.name}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center bg-green-500 text-white py-1 px-3 rounded-lg hover:bg-green-600 transition"
                  >
                    <FaWhatsapp className="mr-1" /> Mensaje
                  </a>
                </div>
              ))}
            </div>
          </div>
            </div>
            
            
          )}

          {/* Lista de vistas con botón de WhatsApp */}
          

          {/* Botones de acción principales */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 mt-6">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition font-semibold"
            >
              <FaWhatsapp className="mr-2" /> Contactar por WhatsApp
            </a>
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              <FaMap className="mr-2" /> Ver en Google Maps
            </a>
            <button
              onClick={handleAddToFavorites}
              className="flex items-center justify-center bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition font-semibold"
            >
              <FaHeart className="mr-2" /> Añadir a Favoritos
            </button>
          </div>
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
    </div>,
    document.body
  );
};

export default PostDetailsModal;
