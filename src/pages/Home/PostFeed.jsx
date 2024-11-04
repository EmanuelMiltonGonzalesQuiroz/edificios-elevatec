import React, { useState, useEffect } from 'react';
import { db } from '../../connection/firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { Carousel } from 'react-responsive-carousel';
import { FaMapMarkerAlt, FaHome, FaDollarSign, FaMapSigns, FaBuilding } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PostDetailsModal from './PostDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PostFeed = ({ filters }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublications = async () => {
      setLoading(true);
      try {
        let q = query(collection(db, 'publications'), where('state', '!=', 'inactive'));

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
          .sort((a, b) => {
            if (a.state === 'priority' && b.state !== 'priority') return -1;
            if (a.state !== 'priority' && b.state === 'priority') return 1;
            return new Date(b.uploadedAt) - new Date(a.uploadedAt);
          });

        setPublications(publicationsData);
      } catch (error) {
        console.error('Error al obtener publicaciones:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublications();
  }, [filters]);

  const handlePublicationClick = async (publication) => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setSelectedPublication(publication);

    try {
      if (currentUser.uid) {
        const publicationRef = doc(db, 'publications', publication.id);
        await updateDoc(publicationRef, {
          views: arrayUnion(currentUser.uid || currentUser.id),
        });
      } else {
        console.error('Error: currentUser.uid está indefinido.');
      }
    } catch (error) {
      console.error('Error al registrar la vista:', error);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando publicaciones...</p>;

  return (
    <div className="p-4 space-y-4">
      {publications.length === 0 ? (
        <p className="text-center text-gray-500">No hay publicaciones disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publications.map((pub) => (
            <div
              key={pub.id}
              onClick={(e) => {
                if (!e.target.closest('.carousel-root')) {
                  handlePublicationClick(pub);
                }
              }}
              className="border rounded-lg p-4 shadow-lg bg-white transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
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
                <FaBuilding />
                <p>Tipo de Lugar: {pub.placeType}</p>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaMapSigns />
                <p>Dirección: {pub.address}</p>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaHome />
                <p>Tipo: {pub.transactionType}</p>
              </div>

              {/* Carga diferida de imágenes y muestra solo la primera inicialmente */}
              {pub.imageUrls && pub.imageUrls.length > 0 && (
                <Carousel
                  showThumbs={false}
                  showIndicators={false}
                  showStatus={false}
                  dynamicHeight={true}
                  infiniteLoop={true}
                  className="mt-4 max-h-60 min-h-60 rounded-lg overflow-hidden carousel-root"
                  lazyLoad={true}
                >
                  {pub.imageUrls.map((url, index) => (
                    <div key={url} className="cursor-pointer">
                      <img src={url} alt={`Imagen ${index + 1}`} className="object-cover rounded-lg max-h-60 min-h-60" />
                    </div>
                  ))}
                </Carousel>
              )}
            </div>
          ))}
        </div>
      )}

      {selectedPublication && (
        <PostDetailsModal 
          publication={selectedPublication} 
          onClose={() => setSelectedPublication(null)} 
          onDeletePublication={(deletedId) => {
            setPublications((prevPublications) => prevPublications.filter(pub => pub.id !== deletedId));
            setSelectedPublication(null);
          }}
        />
      )}
    </div>
  );
};

export default PostFeed;
