import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../connection/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaWhatsapp, FaRuler, FaBed, FaBath } from 'react-icons/fa';

const cities = [
  { value: 'Santa Cruz', label: 'Santa Cruz' },
  { value: 'La Paz', label: 'La Paz' },
  { value: 'Cochabamba', label: 'Cochabamba' },
  // Añadir otras 27 ciudades importantes
  { value: 'Otra', label: 'Otra' }
];

const transactionTypes = [
  { value: 'venta', label: 'Venta' },
  { value: 'preventa', label: 'Preventa' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' }
];

const CreateAd = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
    }
  }, [currentUser, navigate]);

  const [formData, setFormData] = useState({
    id: `ID-Publication-${uuidv4().slice(0, 8)}`,
    name: '',
    amount: '',
    contact: '',
    description: '',
    transactionType: '',
    imageUrls: [],
    city: '',
    customCity: '',
    rooms: '',
    bathrooms: '',
    area: '',
    latitude: '',
    longitude: '',
    state: 'active',
    uploadedAt: new Date().toISOString().split('T')[0],
    uploadedBy: currentUser?.uid || '',
    deletedBy: '',
  });

  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCityChange = (selectedOption) => {
    setFormData({ ...formData, city: selectedOption.value });
  };

  const handleTransactionTypeChange = (selectedOption) => {
    setFormData({ ...formData, transactionType: selectedOption.value });
  };

  const handleImageChange = (e) => {
    setImages(e.target.files);
  };

  const handleUpload = async () => {
    setUploading(true);
    const imageUrls = [];

    for (const image of images) {
      const imageRef = ref(storage, `${formData.id}/${image.name}-${uuidv4()}`);
      await uploadBytes(imageRef, image);
      const imageUrl = await getDownloadURL(imageRef);
      imageUrls.push(imageUrl);
    }

    return imageUrls;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const imageUrls = await handleUpload();
      const completeData = { 
        ...formData,
        imageUrls,
        city: formData.city === 'Otra' ? formData.customCity : formData.city 
      };

      await setDoc(doc(db, 'publications', formData.id), completeData);
      alert('Publicación creada exitosamente');
    } catch (error) {
      console.error('Error al crear la publicación:', error);
    } finally {
      setUploading(false);
    }
  };

  // Función para renderizar un input con etiqueta y opcionalmente un icono
  const renderLabeledInput = (label, name, type, icon) => (
    <div>
      <label className="block text-gray-700 text-sm mb-1 flex items-center">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={formData[name]}
        onChange={handleInputChange}
        required
        className="w-full p-1 border rounded"
      />
    </div>
  );

  return (
    <div className="p-4 min-w-[40vw] max-w-[90vw] mx-auto bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="grid gap-4">
        
        {/* Nombre y Monto */}
        <div className="grid grid-cols-2 gap-4">
          {renderLabeledInput('Nombre', 'name', 'text')}
          {renderLabeledInput('Monto', 'amount', 'text')}
        </div>

        {/* Contacto */}
        {renderLabeledInput('Contacto', 'contact', 'text', <FaWhatsapp className="text-green-600" />)}

        {/* Tipo de Transacción */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Tipo de Transacción</label>
          <Select
            options={transactionTypes}
            onChange={handleTransactionTypeChange}
            className="mb-2"
          />
        </div>

        {/* Ciudad */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Ciudad</label>
          <Select
            options={cities}
            onChange={handleCityChange}
            className="mb-2"
          />
          {formData.city === 'Otra' && (
            <input
              type="text"
              name="customCity"
              value={formData.customCity}
              onChange={handleInputChange}
              placeholder="Especifique la ciudad"
              className="w-full p-1 border rounded"
            />
          )}
        </div>

        {/* Habitaciones, Baños y Área */}
        <div className="grid grid-cols-3 gap-4">
          {renderLabeledInput('Habitaciones', 'rooms', 'number', <FaBed />)}
          {renderLabeledInput('Baños', 'bathrooms', 'number', <FaBath />)}
          {renderLabeledInput('Área (m²)', 'area', 'number', <FaRuler />)}
        </div>

        {/* Coordenadas */}
        <div className="grid grid-cols-2 gap-4">
          {renderLabeledInput('Latitud', 'latitude', 'number')}
          {renderLabeledInput('Longitud', 'longitude', 'number')}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            className="w-full p-1 border rounded"
          />
        </div>

        {/* Imágenes */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Imágenes</label>
          <input
            type="file"
            multiple
            onChange={handleImageChange}
            className="w-full p-1 border rounded"
          />
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          {uploading ? 'Subiendo...' : 'Crear Publicación'}
        </button>
      </form>
    </div>
  );
};

export default CreateAd;
