import React from 'react';
import { db } from '../../connection/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

const DeleteButton = ({ row, collectionName, onDeleteSuccess }) => {
  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el registro "${row.name || row.id}"?`)) {
      try {
        await deleteDoc(doc(db, collectionName, row.id)); // Eliminar el documento de la colección pasada como prop
        alert("Registro eliminado correctamente.");
        if (onDeleteSuccess) onDeleteSuccess(row.id); // Llamar al callback si está definido
      } catch (error) {
        console.error("Error al eliminar el registro:", error);
        alert("Hubo un error al eliminar el registro.");
      }
    }
  };

  return (
    <button
      onClick={handleDelete}
      className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600 transition"
    >
      Eliminar
    </button>
  );
};

export default DeleteButton;
