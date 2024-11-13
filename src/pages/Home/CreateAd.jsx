import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db, storage } from '../../connection/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { FaWhatsapp, FaRuler, FaBed, FaBath, FaMapMarkerAlt, FaPaste } from 'react-icons/fa';
import data from '../../components/common/Text/data.json';
import FileUploader from '../../components/Upload/FileUploader';
import DatabaseSelectInput from '../../components/layout/DatabaseSelectInput';

const LabeledInput = ({ label, name, type, icon, placeholder, value, onChange, isRequired = true }) => (
  <div>
    <label className="block text-gray-700 text-sm mb-1 flex items-center">
      {icon && <span className="mr-1">{icon}</span>}
      {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      required={isRequired} // Usa isRequired para controlar si es requerido o no
      placeholder={placeholder}
      className="w-full p-1 border rounded"
    />
  </div>
);


const SelectInput = ({ label, options, onChange, value }) => (
  <div>
    <label className="block text-gray-700 text-sm mb-1">{label}</label>
    <Select
      options={options}
      onChange={onChange}
      value={options.find(option => option.value === value)}
      className="mb-2"
    />
  </div>
);

const CreateAd = ({ onClose, onPostCreated }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const initialState = {
    id: `ID-Publication-${uuidv4().slice(0, 8)}`,
    name: '',
    amount: '',
    currency: 'USD',  
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
  };

  const [formData, setFormData] = useState(initialState);
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!currentUser) navigate('/login');
  }, [currentUser, navigate]);

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  const handleSelectChange = (name) => (selectedOption) => setFormData({ ...formData, [name]: selectedOption.value });
  const handleImageChange = (e) => setImages(e.target.files);

  const handleUpload = async () => {
    setUploading(true);
    const imageUrls = await Promise.all([...images].map(async (image) => {
      const imageRef = ref(storage, `${formData.id}/${image.name}-${uuidv4()}`);
      await uploadBytes(imageRef, image);
      return await getDownloadURL(imageRef);
    }));
    setUploading(false);
    return imageUrls;
  };

  const handlePasteCoordinates = async () => {
    try {
      const text = await navigator.clipboard.readText();
      const coordinates = text.match(/-?\d+\.\d+/g);
      if (coordinates && coordinates.length >= 2) {
        setFormData({
          ...formData,
          latitude: coordinates[0],
          longitude: coordinates[1],
        });
      } else {
        alert('El sistema dice: No se detectaron coordenadas válidas en el portapapeles.');
      }
    } catch (error) {
      console.error('Error al leer el portapapeles:', error);
    }
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
      onClose();
      setFormData(initialState);

      if (onPostCreated) onPostCreated(); // Llama a onPostCreated después de crear la publicación

    } catch (error) {
      console.error('Error al crear la publicación:', error);
    }
  };
  
  const handleCurrencyChange = (e) => {
    setFormData({ ...formData, currency: e.target.value });
  };

  return (
    <div className="p-4 min-w-[40vw] max-w-[90vw] mx-auto bg-white rounded-lg shadow-lg">
      <form onSubmit={handleSubmit} className="grid gap-4">
      <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
        <LabeledInput label="Nombre" name="name" type="text" value={formData.name} onChange={handleInputChange} placeholder="Ejemplo: Departamento de lujo" />
        <LabeledInput label="Monto" name="amount" type="text" value={formData.amount} onChange={handleInputChange} placeholder="Ejemplo: 120000" isRequired={false} />
        <div className="flex flex-col">
          <label className="block text-gray-700 text-sm mb-1">Moneda</label>
          <div className="flex space-x-4">
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="currency"
                value="USD"
                checked={formData.currency === 'USD'}
                onChange={handleCurrencyChange}
                className="form-radio"
              />
              <span>Dólar</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name="currency"
                value="BOB"
                checked={formData.currency === 'BOB'}
                onChange={handleCurrencyChange}
                className="form-radio"
              />
              <span>Boliviano</span>
            </label>
          </div>
        </div>
      </div>


        <LabeledInput label="Contacto" name="contact" type="text" icon={<FaWhatsapp className="text-green-600" />} value={formData.contact} onChange={handleInputChange} placeholder="Ejemplo: +59112345678" />

        <DatabaseSelectInput label="Tipo de Lugar" documentName="placeTypes" onChange={handleSelectChange('placeType')} value={formData.placeType} />
        <DatabaseSelectInput label="Tipo de Transacción" documentName="contractTypes" onChange={handleSelectChange('transactionType')} value={formData.transactionType} />
        <SelectInput label="Ciudad" options={data.cities} onChange={handleSelectChange('city')} value={formData.city} />

        {formData.city === 'Otra' && (
          <LabeledInput label="Especifique la ciudad" name="customCity" type="text" value={formData.customCity} onChange={handleInputChange} />
        )}

        <LabeledInput label="Dirección" name="address" type="text" value={formData.address} onChange={handleInputChange} placeholder="Ejemplo: Av. Principal 123" />

        <div className="grid sm:grid-cols-3 grid-cols-1 gap-4">
          <LabeledInput label="Habitaciones" name="rooms" type="number" icon={<FaBed />} value={formData.rooms} onChange={handleInputChange} placeholder="Ejemplo: 3" />
          <LabeledInput label="Baños" name="bathrooms" type="number" icon={<FaBath />} value={formData.bathrooms} onChange={handleInputChange} placeholder="Ejemplo: 2" />
          <LabeledInput label="Área (m²)" name="area" type="number" icon={<FaRuler />} value={formData.area} onChange={handleInputChange} placeholder="Ejemplo: 120" />
        </div>

        {/* Botón para abrir Google Maps y pegar coordenadas */}
        <div className="flex flex-col gap-4 ">
            <button
              type="button"
              onClick={() => window.open('https://www.google.com/maps', '_blank')}
              className="bg-blue-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-blue-600"
            >
              <FaMapMarkerAlt /> Abrir Google Maps
            </button>
            <button
              type="button"
              onClick={handlePasteCoordinates}
              className="bg-green-500 text-white py-2 px-4 rounded flex items-center gap-2 hover:bg-green-600"
            >
              <FaPaste /> Pegar Coordenadas
            </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <LabeledInput label="Latitud" name="latitude" type="text" value={formData.latitude} onChange={handleInputChange} placeholder="Ejemplo: -17.78629" />
          <LabeledInput label="Longitud" name="longitude" type="text" value={formData.longitude} onChange={handleInputChange} placeholder="Ejemplo: -63.18117" />
        </div>

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

        <FileUploader
          label="Imágenes"
          acceptedTypes={["image/*"]}
          onChange={handleImageChange}
        />

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
