import React from 'react';
import { FaPlus, FaTrash } from 'react-icons/fa';
import ToggleStatus from '../UI/ToggleStatus';

const ContractTypeSettings = ({ contractTypes, setContractTypes }) => {
  const handleAddContractType = () => {
    setContractTypes([...contractTypes, { label: '', enabled: true }]);
  };

  const handleRemoveContractType = (index) => {
    setContractTypes(contractTypes.filter((_, i) => i !== index));
  };

  const handleStatusChange = (index, isEnabled) => {
    setContractTypes((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, enabled: isEnabled } : item
      )
    );
  };

  const handleLabelChange = (index, newLabel) => {
    setContractTypes((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, label: newLabel } : item
      )
    );
  };

  return (
    <div className="space-y-2">
      <h3 className="font-semibold text-gray-700">Tipos de Contrato</h3>
      {contractTypes.map((type, index) => (
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
            onClick={() => handleRemoveContractType(index)}
            className="text-red-500"
          >
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
  );
};

export default ContractTypeSettings;
