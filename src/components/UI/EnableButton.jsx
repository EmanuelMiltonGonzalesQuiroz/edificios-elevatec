// EnableButton.js
import React from 'react';
import { db } from '../../connection/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const EnableButton = ({ row, collectionName, onEnableSuccess }) => {
  const handleEnable = async () => {
    if (window.confirm(`¿Estás seguro de que deseas habilitar el registro "${row.name || row.id}"?`)) {
      try {
        await updateDoc(doc(db, collectionName, row.id), { state: 'active' }); // Cambia el estado a 'active'
        alert("Registro habilitado correctamente.");
        if (onEnableSuccess) onEnableSuccess(row.id); // Llama al callback si está definido
      } catch (error) {
        console.error("Error al habilitar el registro:", error);
        alert("Hubo un error al habilitar el registro.");
      }
    }
  };

  return (
    <button
      onClick={handleEnable}
      className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600 transition w-full"
    >
      Habilitar
    </button>
  );
};

export default EnableButton;
