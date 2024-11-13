import React, { useEffect, useState } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { db } from '../../connection/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Switch from 'react-switch';

const defaultContractTypes = [
  { label: 'Venta' },
  { label: 'Alquiler' },
  { label: 'Anticrético' },
  { label: 'Preventa' },
];

const defaultPlaceTypes = [
  { label: 'Departamento' },
  { label: 'Edificio' },
  { label: 'Casa' },
  { label: 'Local' },
  { label: 'Oficina' },
];

const SettingsModal = ({ onClose }) => {
  const [contractTypes, setContractTypes] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);
  const [settings, setSettings] = useState({
    publishDetail: false, // Detalles de publicaciones sin estar logeado
  });

  useEffect(() => {
    const fetchSettings = async () => {
      const contractTypesDoc = doc(db, 'settings', 'contractTypes');
      const placeTypesDoc = doc(db, 'settings', 'placeTypes');
      const generalSettingsDoc = doc(db, 'settings', 'views_without_login');

      const contractSnapshot = await getDoc(contractTypesDoc);
      const placeSnapshot = await getDoc(placeTypesDoc);
      const generalSnapshot = await getDoc(generalSettingsDoc);

      if (contractSnapshot.exists()) {
        setContractTypes(contractSnapshot.data().options);
      } else {
        await setDoc(contractTypesDoc, { options: defaultContractTypes });
        setContractTypes(defaultContractTypes);
      }

      if (placeSnapshot.exists()) {
        setPlaceTypes(placeSnapshot.data().options);
      } else {
        await setDoc(placeTypesDoc, { options: defaultPlaceTypes });
        setPlaceTypes(defaultPlaceTypes);
      }

      // Configuración de switches generales
      if (generalSnapshot.exists()) {
        setSettings(generalSnapshot.data());
      } else {
        await setDoc(generalSettingsDoc, { publishDetail: false });
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const contractTypesDoc = doc(db, 'settings', 'contractTypes');
      const placeTypesDoc = doc(db, 'settings', 'placeTypes');
      const generalSettingsDoc = doc(db, 'settings', 'views_without_login');

      await setDoc(contractTypesDoc, { options: contractTypes });
      await setDoc(placeTypesDoc, { options: placeTypes });
      await setDoc(generalSettingsDoc, settings);

      if (typeof onClose === 'function') {
        onClose(); // Cierra el modal después de guardar exitosamente
      }
    } catch (error) {
      console.error('Error al guardar configuraciones:', error);
    }
  };

  const handleSwitchChange = (settingName) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [settingName]: !prevSettings[settingName],
    }));
  };

  const handleAddContractType = () => {
    setContractTypes([...contractTypes, { label: '' }]);
  };

  const handleAddPlaceType = () => {
    setPlaceTypes([...placeTypes, { label: '' }]);
  };

  const handleRemoveContractType = (index) => {
    setContractTypes(contractTypes.filter((_, i) => i !== index));
  };

  const handleRemovePlaceType = (index) => {
    setPlaceTypes(placeTypes.filter((_, i) => i !== index));
  };

  return (
    <div className="min-w-[40vw]">
      {/* Configuración de Vistas Sin Login */}
      <h3 className="font-semibold text-gray-700 mb-2">Vistas de lo Usuarios sin Inicio de Sesión</h3>
      <div className="space-y-4 mb-6">
        {/* Lista de switches configurables */}
        <div className="flex items-center space-x-4">
          <span className="text-gray-600 font-medium">Detalles de las Publicaciones</span>
          <Switch
            onChange={() => handleSwitchChange('publishDetail')}
            checked={settings.publishDetail}
            onColor="#4CAF50"
            offColor="#ccc"
            uncheckedIcon={false}
            checkedIcon={false}
          />
        </div>
      </div>

      {/* Ajustes de tipos de contrato */}
      <div className="space-y-2">
        <h3 className="font-semibold text-gray-700">Tipos de Contrato</h3>
        {contractTypes.map((type, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Label"
              value={type.label}
              onChange={(e) =>
                setContractTypes((prev) =>
                  prev.map((item, i) => (i === index ? { ...item, label: e.target.value } : item))
                )
              }
              className="w-full p-1 border rounded"
            />
            <button onClick={() => handleRemoveContractType(index)} className="text-red-500">
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddContractType}
          className="flex items-center text-blue-500 mt-2"
        >
          <FaPlus className="mr-1" /> Añadir Tipo de Contrato
        </button>
      </div>

      {/* Ajustes de tipos de edificio */}
      <div className="space-y-2 mt-4">
        <h3 className="font-semibold text-gray-700">Tipos de Edificio</h3>
        {placeTypes.map((type, index) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Label"
              value={type.label}
              onChange={(e) =>
                setPlaceTypes((prev) =>
                  prev.map((item, i) => (i === index ? { ...item, label: e.target.value } : item))
                )
              }
              className="w-full p-1 border rounded"
            />
            <button onClick={() => handleRemovePlaceType(index)} className="text-red-500">
              <FaTrash />
            </button>
          </div>
        ))}
        <button
          onClick={handleAddPlaceType}
          className="flex items-center text-blue-500 mt-2"
        >
          <FaPlus className="mr-1" /> Añadir Tipo de Edificio
        </button>
      </div>

      {/* Botón Guardar */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleSave}
          className="flex items-center justify-center space-x-2 bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          <FaSave />
          <span>Guardar</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
