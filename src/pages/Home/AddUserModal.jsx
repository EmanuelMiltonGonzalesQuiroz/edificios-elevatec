import React, { useState } from 'react';
import { db } from '../../connection/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { FaSave} from 'react-icons/fa';

const AddUserModal = ({ onAddUserSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Usuario');

  const handleAddUser = async () => {
    try {
      const newUser = {
        id: uuidv4(),
        username,
        email,
        phone,
        role,
        state: 'active', // Usuario registrado como activo por defecto
        fechaCreacion: new Date().toISOString(),
      };

      await setDoc(doc(db, 'users', newUser.id), newUser);
      onAddUserSuccess(newUser); // Agrega el usuario y cierra el modal en UserManagement
    } catch (error) {
      console.error('Error al agregar usuario:', error.message);
    }
  };

  return (
    <div className="space-y-4 min-w-[30vw]">
      <div>
        <label className="block text-gray-700">Nombre</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Nombre"
        />
      </div>
      <div>
        <label className="block text-gray-700">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Email"
        />
      </div>
      <div>
        <label className="block text-gray-700">Teléfono</label>
        <input
          type="text"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full p-2 border rounded"
          placeholder="Teléfono"
        />
      </div>
      <div>
        <label className="block text-gray-700">Rol</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="w-full p-2 border rounded"
        >
          <option value="Usuario">Usuario</option>
          <option value="Administrador">Administrador</option>
          <option value="Gerencia">Gerencia</option>
          <option value="Inmobiliario">Inmobiliario</option>
          <option value="Inmobiliario Plus">Inmobiliario Plus</option>
          <option value="Cliente">Cliente</option>
        </select>
      </div> 
      <div className="flex justify-center mt-4">
        <button
            onClick={handleAddUser}
            className="flex items-center justify-center space-x-2 bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 w-full"
        >
            <FaSave />
            <span>Guardar</span>
        </button>
        </div>
    </div>
  );
};

export default AddUserModal;
