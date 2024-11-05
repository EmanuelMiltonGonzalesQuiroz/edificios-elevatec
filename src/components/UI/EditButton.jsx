import React, { useState } from 'react';
import { db } from '../../connection/firebase';
import { doc, updateDoc } from 'firebase/firestore';
import OpenModalButton from '../../components/UI/OpenModalButton';

const EditButton = ({ row, fieldsConfig, onUpdateSuccess, collectionName }) => {
  const [formData, setFormData] = useState({ ...row });
  const [errors, setErrors] = useState({});

  const handleChange = (e, validation) => {
    const { name, value } = e.target;
    let error = '';

    if (validation && !validation.test(value)) {
      error = `Valor no válido para ${name}`;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSaveChanges = async () => {
    if (Object.values(errors).some((err) => err)) {
      alert('Corrige los errores antes de guardar.');
      return;
    }

    try {
      await updateDoc(doc(db, collectionName, formData.id), formData);
      alert("Actualización exitosa.");
      if (onUpdateSuccess) onUpdateSuccess(formData); // Callback opcional para actualizar la UI
    } catch (error) {
      console.error("Error al actualizar el documento:", error);
      alert("Hubo un error al actualizar.");
    }
  };

  const ModalContent = ({ onClose }) => (
    <form className="space-y-4 min-w-[30vw] max-w-[90vw]">
      {/* Renderizar campos basados en la configuración */}
      {fieldsConfig.map((field) => (
        <div key={field.name}>
          <label className="block text-gray-700 font-semibold">{field.label}</label>
          {field.type === 'input' && (
            <input
              type="text"
              name={field.name}
              value={formData[field.name] || ''}
              readOnly={!field.editable}
              onChange={(e) => field.editable && handleChange(e, field.validation)}
              className={`w-full p-2 border rounded ${!field.editable ? 'bg-gray-200' : ''}`}
            />
          )}
          {field.type === 'textarea' && (
            <textarea
              name={field.name}
              value={formData[field.name] || ''}
              readOnly={!field.editable}
              onChange={(e) => field.editable && handleChange(e)}
              className={`w-full p-2 border rounded ${!field.editable ? 'bg-gray-200' : ''}`}
              rows={4}
            />
          )}
          {field.type === 'select' && (
            <select
              name={field.name}
              value={formData[field.name] || ''}
              onChange={(e) => field.editable && setFormData({ ...formData, [field.name]: e.target.value })}
              className="w-full p-2 border rounded"
              disabled={!field.editable}
            >
              {field.options.map((option) => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          )}
          {errors[field.name] && <p className="text-red-500 text-sm">{errors[field.name]}</p>}
        </div>
      ))}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          type="button"
          onClick={() => {
            handleSaveChanges();
            onClose();
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition w-full"
        >
          Guardar Cambios
        </button>
      </div>
    </form>
  );

  return (
    <OpenModalButton 
      buttonText="Editar" 
      modalContent={ModalContent} 
      title="Editar Registro" 
      className="bg-green-500 text-white text-center flex justify-center items-center w-full h-[30px] rounded hover:bg-yellow-600 transition" 
    />
  );
};

export default EditButton;
