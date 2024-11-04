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
  { value: 'El Alto', label: 'El Alto' },
  { value: 'Oruro', label: 'Oruro' },
  { value: 'Sucre', label: 'Sucre' },
  { value: 'Tarija', label: 'Tarija' },
  { value: 'Potosí', label: 'Potosí' },
  { value: 'Trinidad', label: 'Trinidad' },
  { value: 'Montero', label: 'Montero' },
  { value: 'Quillacollo', label: 'Quillacollo' },
  { value: 'Riberalta', label: 'Riberalta' },
  { value: 'Guayaramerín', label: 'Guayaramerín' },
  { value: 'Cobija', label: 'Cobija' },
  { value: 'Yacuiba', label: 'Yacuiba' },
  { value: 'Sacaba', label: 'Sacaba' },
  { value: 'Camiri', label: 'Camiri' },
  { value: 'Tupiza', label: 'Tupiza' },
  { value: 'Villazón', label: 'Villazón' },
  { value: 'San Ignacio de Velasco', label: 'San Ignacio de Velasco' },
  { value: 'Warnes', label: 'Warnes' },
  { value: 'Villa Montes', label: 'Villa Montes' },
  { value: 'Llallagua', label: 'Llallagua' },
  { value: 'Caranavi', label: 'Caranavi' },
  { value: 'San Borja', label: 'San Borja' },
  { value: 'Huanuni', label: 'Huanuni' },
  { value: 'Punata', label: 'Punata' },
  { value: 'Rurrenabaque', label: 'Rurrenabaque' },
  { value: 'Uyuni', label: 'Uyuni' },
  { value: 'Otra', label: 'Otra' }
];


const transactionTypes = [
  { value: 'venta', label: 'Venta' },
  { value: 'preventa', label: 'Preventa' },
  { value: 'alquiler', label: 'Alquiler' },
  { value: 'anticretico', label: 'Anticrético' }
];

const placeTypes = [
  { value: 'departamento', label: 'Departamento' },
  { value: 'edificio', label: 'Edificio' },
  { value: 'casa', label: 'Casa' },
  { value: 'local', label: 'Local' },
  { value: 'oficina', label: 'Oficina' }
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
    contact: currentUser?.phone || '',
    description: '',
    transactionType: '',
    placeType: '',
    address: '',
    imageUrls: [],
    city: '',
    customCity: '',
    rooms: '',
    bathrooms: '',
    area: '',
    latitude: '',
    longitude: '',
    state: (currentUser?.role === 'Administrador' || currentUser?.role === 'Inmobiliario Plus') ? 'priority' : 'active',
    uploadedAt: new Date().toISOString().split('T')[0],
    uploadedBy: currentUser?.uid || currentUser?.id || "",
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

  const handlePlaceTypeChange = (selectedOption) => {
    setFormData({ ...formData, placeType: selectedOption.value });
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
  const renderLabeledInput = (label, name, type, icon, placeholder = '') => (
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
        placeholder={placeholder}
        className="w-full p-1 border rounded"
      />
    </div>
  );

  return (
    <div className="p-4 min-w-[40vw] max-w-[90vw] mx-auto bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="grid gap-4">
        
        {/* Nombre y Monto */}
        <div className="grid grid-cols-2 gap-4">
          {renderLabeledInput('Nombre', 'name', 'text', null, 'Ejemplo: Departamento de lujo')}
          {renderLabeledInput('Monto', 'amount', 'text', null, 'Ejemplo: 120000')}
        </div>

        {/* Contacto */}
        {renderLabeledInput('Contacto', 'contact', 'text', <FaWhatsapp className="text-green-600" />, 'Ejemplo: +59112345678')}

        {/* Tipo de Lugar */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Tipo de Lugar</label>
          <Select
            options={placeTypes}
            onChange={handlePlaceTypeChange}
            className="mb-2"
          />
        </div>

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

        {/* Dirección */}
        {renderLabeledInput('Dirección', 'address', 'text', null, 'Ejemplo: Av. Principal 123')}

        {/* Habitaciones, Baños y Área */}
        <div className="grid grid-cols-3 gap-4">
          {renderLabeledInput('Habitaciones', 'rooms', 'number', <FaBed />, 'Ejemplo: 3')}
          {renderLabeledInput('Baños', 'bathrooms', 'number', <FaBath />, 'Ejemplo: 2')}
          {renderLabeledInput('Área (m²)', 'area', 'number', <FaRuler />, 'Ejemplo: 120')}
        </div>

        {/* Coordenadas */}
        <div className="grid grid-cols-2 gap-4">
          {renderLabeledInput('Latitud', 'latitude', 'number', null, 'Ejemplo: -17.78629')}
          {renderLabeledInput('Longitud', 'longitude', 'number', null, 'Ejemplo: -63.18117')}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-gray-700 text-sm mb-1">Descripción</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Ejemplo: Propiedad con acabados de lujo, cerca de colegios y supermercados..."
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
