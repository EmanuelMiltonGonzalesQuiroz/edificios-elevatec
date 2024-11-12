import React, { useEffect, useState } from 'react';
import { db } from '../../connection/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { FaMapMarkerAlt, FaHome, FaDollarSign, FaMapSigns, FaBuilding } from 'react-icons/fa';
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import PostDetailsModal from './PostDetailsModal';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PublishedPosts = () => {
  const { currentUser } = useAuth();
  const [publishedPosts, setPublishedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPublication, setSelectedPublication] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPublishedPosts = async () => {
      if (!currentUser) {
        navigate('/login');
        return;
      }

      setLoading(true);
      try {
        const q = query(
          collection(db, 'publications'),
          where('uploadedBy', '==', currentUser.uid || currentUser.id)
        );
        const querySnapshot = await getDocs(q);
        const postsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setPublishedPosts(postsData);
      } catch (error) {
        console.error('Error al obtener publicaciones publicadas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPublishedPosts();
  }, [currentUser, navigate]);

  const handlePublicationClick = (post) => {
    setSelectedPublication(post);
  };

  if (loading) return <p className="text-center text-gray-500">Cargando publicaciones publicadas...</p>;

  return (
    <div className="p-4 space-y-4">
      {publishedPosts.length === 0 ? (
        <p className="text-center text-gray-500">No has publicado ninguna publicación.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {publishedPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => handlePublicationClick(post)}
              className="border rounded-lg p-4 shadow-lg bg-white transition-transform transform hover:scale-105 hover:shadow-2xl cursor-pointer"
            >
              <h3 className="text-xl font-bold mb-2 text-gray-800">{post.name}</h3>

              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaDollarSign />
                <p className="text-gray-700">${post.amount}</p>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaMapMarkerAlt />
                <p>{post.city}</p>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaBuilding />
                <p>Tipo de Lugar: {post.placeType}</p>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaMapSigns />
                <p>Dirección: {post.address}</p>
              </div>

              <div className="flex items-center space-x-2 text-gray-600 mb-1">
                <FaHome />
                <p>Tipo: {post.transactionType}</p>
              </div>

              {post.imageUrls && post.imageUrls.length > 0 && (
                <Carousel
                  showThumbs={false}
                  showIndicators={false}
                  showStatus={false}
                  dynamicHeight={true}
                  infiniteLoop={true}
                  className="mt-4 max-h-60 min-h-60 rounded-lg overflow-hidden carousel-root"
                  lazyLoad={true}
                >
                  {post.imageUrls.map((url, index) => (
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
        />
      )}
    </div>
  );
};

export default PublishedPosts;
