import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ToggleStatus from '../UI/ToggleStatus';

const PlaceTypeSettings = ({ placeTypes, setPlaceTypes }) => {
  const handleAddPlaceType = () => {
    setPlaceTypes([...placeTypes, { label: '', enabled: true }]);
  };

  const handleRemovePlaceType = (index) => {
    setPlaceTypes(placeTypes.filter((_, i) => i !== index));
  };

  const handleStatusChange = (index, isEnabled) => {
    setPlaceTypes((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: isEnabled } : item
      )
    );
  };

  const handleLabelChange = (index, newLabel) => {
    setPlaceTypes((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, label: newLabel } : item
      )
    );
  };

  return (
    <div className="space-y-2 mt-4">
      <h3 className="font-semibold text-gray-700">Tipos de Edificio</h3>
      {placeTypes.map((type, index) => (
        <div key={index} className="flex items-center space-x-4">
          <input
            type="text"
            placeholder="Label"
            value={type.label}
            onChange={(e) => handleLabelChange(index, e.target.value)}
            className="w-full p-1 border rounded"
          />
          <ToggleStatus
            enabled={type.enabled}
            onChange={(isEnabled) => handleStatusChange(index, isEnabled)}
          />
          <button
            onClick={() => handleRemovePlaceType(index)}
            className="text-red-500"
          >
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
  );
};

export default PlaceTypeSettings;
