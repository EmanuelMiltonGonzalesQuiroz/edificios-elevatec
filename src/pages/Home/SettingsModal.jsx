import React, { useEffect, useState } from 'react';
import { FaSave, FaPlus, FaTrash } from 'react-icons/fa';
import { db } from '../../connection/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

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

const SettingsModal = () => {
  const [contractTypes, setContractTypes] = useState([]);
  const [placeTypes, setPlaceTypes] = useState([]);

  useEffect(() => {
    const fetchSettings = async () => {
      const contractTypesDoc = doc(db, 'settings', 'contractTypes');
      const placeTypesDoc = doc(db, 'settings', 'placeTypes');

      const contractSnapshot = await getDoc(contractTypesDoc);
      const placeSnapshot = await getDoc(placeTypesDoc);

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
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    const contractTypesDoc = doc(db, 'settings', 'contractTypes');
    const placeTypesDoc = doc(db, 'settings', 'placeTypes');

    await setDoc(contractTypesDoc, { options: contractTypes });
    await setDoc(placeTypesDoc, { options: placeTypes });
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
    <div className='min-w-[40vw]'>
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
      <div className="flex justify-end mt-4">
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
          <FaSave />
          <span>Guardar</span>
        </button>
      </div>
    </div>
  );
};

export default SettingsModal;
