import React, { useState, useEffect, useCallback } from 'react';
import { db } from '../../connection/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Carousel } from 'react-responsive-carousel';
import { FaMapMarkerAlt, FaHome, FaMapSigns, FaBuilding } from 'react-icons/fa';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PostDetailsModal from './PostDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { checkSetting } from './CheckSetting';

const PostFeed = ({ filters }) => {
  const [publications, setPublications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const fetchPublications = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch enabled transactionTypes and placeTypes from settings
      const settingsRef = collection(db, 'settings');
      const [contractTypesDoc, placeTypesDoc] = await Promise.all([
        getDocs(query(settingsRef, where('__name__', '==', 'contractTypes'))),
        getDocs(query(settingsRef, where('__name__', '==', 'placeTypes'))),
      ]);

      const enabledContractTypes = [];
      const enabledPlaceTypes = [];

      if (!contractTypesDoc.empty) {
        const contractTypesData = contractTypesDoc.docs[0].data().options;
        contractTypesData.forEach((type) => {
          if (type.enabled) {
            enabledContractTypes.push(type.label.toLowerCase());
          }
        });
      }

      if (!placeTypesDoc.empty) {
        const placeTypesData = placeTypesDoc.docs[0].data().options;
        placeTypesData.forEach((type) => {
          if (type.enabled) {
            enabledPlaceTypes.push(type.label.toLowerCase());
          }
        });
      }

      // Build initial query
      let q;

      if (currentUser && currentUser?.role !== 'Administrador') {
        q = query(collection(db, 'publications'), where('state', '!=', 'inactive'));
      } else {
        q = query(collection(db, 'publications'));
      }

      // Apply filters to the query
      if (filters.transactionType) {
        q = query(q, where('transactionType', '==', filters.transactionType));
      }
      if (filters.rooms) {
        q = query(q, where('rooms', '==', filters.rooms));
      }
      if (filters.bathrooms) {
        q = query(q, where('bathrooms', '==', filters.bathrooms));
      }

      const querySnapshot = await getDocs(q);

      // Map publications data
      const publicationsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Fetch uploader user data
      const uploaderIds = [...new Set(publicationsData.map((pub) => pub.uploadedBy))];
      const userDocsPromises = uploaderIds.map((uid) => getDocs(query(collection(db, 'users'), where('uid', '==', uid))));
      const userDocsSnapshots = await Promise.all(userDocsPromises);

      const userMap = {};
      userDocsSnapshots.forEach((userSnapshot) => {
        if (!userSnapshot.empty) {
          const userData = userSnapshot.docs[0].data();
          userMap[userData.uid] = userData;
        }
      });

      // Filter publications
      const filteredPublications = publicationsData
        .filter((pub) => {
          const uploader = userMap[pub.uploadedBy];
          if (!uploader || uploader.state === 'inactive' || uploader.state === 'deleted') {
            return false;
          }

          const transactionType = pub.transactionType?.toLowerCase() || '';
          const placeType = pub.placeType?.toLowerCase() || '';

          if (!enabledContractTypes.includes(transactionType) || !enabledPlaceTypes.includes(placeType)) {
            return false;
          }

          return true;
        })
        .filter((pub) => {
          // Apply additional filters from the 'filters' prop
          const meetsPrice =
            (!filters.priceMin || parseFloat(pub.amount) >= parseFloat(filters.priceMin)) &&
            (!filters.priceMax || parseFloat(pub.amount) <= parseFloat(filters.priceMax));
          const meetsArea =
            (!filters.areaMin || parseFloat(pub.area) >= parseFloat(filters.areaMin)) &&
            (!filters.areaMax || parseFloat(pub.area) <= parseFloat(filters.areaMax));
          const meetsCurrency =
            !filters.currency || pub.currency.toLowerCase() === filters.currency.toLowerCase();
          const meetsState =
            !filters.state || pub.state.toLowerCase() === filters.state.toLowerCase();
          const meetsCity =
            !filters.city || pub.city.toLowerCase() === filters.city.toLowerCase();

          return meetsPrice && meetsArea && meetsCurrency && meetsState && meetsCity;
        })
        .sort((a, b) => {
          if (a.state === 'priority' && b.state !== 'priority') return -1;
          if (a.state !== 'priority' && b.state === 'priority') return 1;
          return new Date(b.uploadedAt) - new Date(a.uploadedAt);
        });

      setPublications(filteredPublications);
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
    } finally {
      setLoading(false);
    }
  }, [filters, currentUser]);

  useEffect(() => {
    fetchPublications();
  }, [fetchPublications]);

  const handlePublicationClick = async (publication) => {
    const permission = await checkSetting('publishDetail');
    if (!currentUser && permission === false) {
      navigate('/login');
      return;
    }

    setSelectedPublication(publication);
  };

  if (loading) return <p className="text-center text-gray-500">Cargando publicaciones...</p>;

  return (
    <div className="p-4 space-y-4">
      {publications.length === 0 ? (
        <p className="text-center text-gray-500">No hay publicaciones disponibles.</p>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
          {publications.map((pub) => (
            <div
              key={pub.id}
              onClick={(e) => {
                if (!e.target.closest('.carousel-root')) {
                  handlePublicationClick(pub);
                }
              }}
              className="border rounded-lg p-4 shadow-lg bg-white transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
              style={{ height: '400px' }}
            >
              <div className="max-h-[320px] overflow-auto">
                <h3 className="text-xl font-bold mb-2 text-gray-800">{pub.name}</h3>
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Información */}
                <div className="overflow-auto max-h-[280px]">
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <FaMapMarkerAlt className="w-4 h-4 flex-shrink-0" />
                    <p>{pub.city}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <FaBuilding className="w-4 h-4 flex-shrink-0" />
                    <p>Inmueble: {pub.placeType}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <FaMapSigns className="w-4 h-4 flex-shrink-0" />
                    <p>Dirección: {pub.address}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600 mb-1">
                    <FaHome className="w-4 h-4 flex-shrink-0" />
                    <p>Contrato: {pub.transactionType}</p>
                  </div>
                </div>
                {/* Carrusel */}
                <div>
                  {pub.imageUrls && pub.imageUrls.length > 0 ? (
                    <Carousel
                      showThumbs={false}
                      showIndicators={false}
                      showStatus={false}
                      dynamicHeight={true}
                      infiniteLoop={true}
                      className="mt-4 max-h-[280px] min-h-[280px] rounded-lg overflow-hidden carousel-root"
                      lazyLoad={true}
                    >
                      {pub.imageUrls.map((url, index) => (
                        <div key={url} className="cursor-pointer">
                          <img
                            src={url}
                            alt={`Imagen ${index + 1}`}
                            className="object-cover rounded-lg max-h-[280px] min-h-[280px]"
                          />
                        </div>
                      ))}
                    </Carousel>
                  ) : (
                    <div className="mt-4 max-h-60 min-h-60 rounded-lg overflow-hidden bg-gray-100 carousel-root"></div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedPublication && (
        <PostDetailsModal
          publication={selectedPublication}
          onClose={() => setSelectedPublication(null)}
          onDeletePublication={(deletedId) => {
            setPublications((prevPublications) =>
              prevPublications.filter((pub) => pub.id !== deletedId)
            );
            setSelectedPublication(null);
          }}
        />
      )}
    </div>
  );
};

export default PostFeed;
