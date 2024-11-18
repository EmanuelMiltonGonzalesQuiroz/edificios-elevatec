import React, { useState } from 'react';
import { db } from '../../connection/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { v4 as uuidv4 } from 'uuid';
import { FaSave } from 'react-icons/fa';

const AddUserModal = ({ onAddUserSuccess }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('Usuario');

  const handleAddUser = async () => {
    try {
      const mainUserUid = uuidv4(); // UID único para el usuario principal
      const baseUser = {
        username,
        email,
        phone,
        state: 'active',
        password: "123",
        fechaCreacion: new Date().toISOString(),
      };

      // Crear usuario principal
      const mainUser = { ...baseUser, uid: mainUserUid, role };
      await setDoc(doc(db, 'users', mainUserUid), mainUser);

      // Crear usuarios adicionales si el rol es "Edificio"
      if (role === 'Edificio') {
        const additionalUsers = [
          {
            ...baseUser,
            uid: uuidv4(),
            username: `${username} Inmobiliario`,
            email:`${email} Inmobiliario`,
            role: 'Inmobiliario',
            ownerUid: mainUserUid, // Propietario del edificio
          },
          {
            ...baseUser,
            uid: uuidv4(),
            username: `${username} InmobiliarioPlus`,
            email:`${email} InmobiliarioPlus`,
            role: 'Inmobiliario Plus',
            ownerUid: mainUserUid, // Propietario del edificio
          },
        ];

        // Guardar usuarios adicionales en Firestore
        for (const additionalUser of additionalUsers) {
          await setDoc(doc(db, 'users', additionalUser.uid), additionalUser);
        }

        // Llamar a la función de éxito con todos los usuarios
        onAddUserSuccess([mainUser, ...additionalUsers]);
      } else {
        // Llamar a la función de éxito solo con el usuario principal
        onAddUserSuccess([mainUser]);
      }
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
          <option value="Edificio">Edificio</option>
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
