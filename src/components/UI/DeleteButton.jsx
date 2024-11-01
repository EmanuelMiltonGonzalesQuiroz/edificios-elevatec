import React from 'react';
import { db } from '../../connection/firebase';
import { deleteDoc, doc } from 'firebase/firestore';

const DeleteButton = ({ row }) => {
  const handleDelete = async () => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar a ${row.username}?`)) {
      try {
        await deleteDoc(doc(db, 'users', row.id)); // Eliminar el documento de la base de datos
        alert("Usuario eliminado correctamente.");
        // Puedes añadir un callback aquí si necesitas actualizar la interfaz de usuario en `UserManagement`
      } catch (error) {
        console.error("Error al eliminar usuario:", error);
        alert("Hubo un error al eliminar el usuario.");
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
