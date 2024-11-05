import React from 'react';
import { db } from '../../connection/firebase';
import { doc, updateDoc } from 'firebase/firestore';

const DisableButton = ({ row, collectionName, onDisableSuccess }) => {
  const handleDisable = async () => {
    if (window.confirm(`¿Estás seguro de que deseas inhabilitar el registro "${row.name || row.id}"?`)) {
      try {
        await updateDoc(doc(db, collectionName, row.id), { state: 'inactive' }); // Cambia el estado a 'inactive'
        alert("Registro inhabilitado correctamente.");
        if (onDisableSuccess) onDisableSuccess(row.id); // Llama al callback si está definido
      } catch (error) {
        console.error("Error al inhabilitar el registro:", error);
        alert("Hubo un error al inhabilitar el registro.");
      }
    }
  };

  return (
    <button
      onClick={handleDisable}
      className="bg-yellow-500 text-white px-2 py-1 rounded hover:bg-yellow-600 transition w-full"
    >
      Inhabilitar
    </button>
  );
};

export default DisableButton;
