import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../connection/firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    username: '',
    email: '',
    fechaCreacion: '',
    phone: '',
    role: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [hasPassword, setHasPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isPasswordChanging, setIsPasswordChanging] = useState(false);


  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return; // Se asegura de detener la ejecución si no hay usuario
    }

    const fetchUserProfile = async () => {
      const userDoc = doc(db, 'users', currentUser.uid);
      const docSnapshot = await getDoc(userDoc);
      if (docSnapshot.exists()) {
        const data = docSnapshot.data();
        setProfileData({
          username: data.username || '',
          email: data.email || '',
          fechaCreacion: data.fechaCreacion || '',
          phone: data.phone || 'N/A',
          role: data.role || 'Usuario',
        });
        setHasPassword(!!data.password);
      }
    };
    
    fetchUserProfile();
  }, [currentUser, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSaveChanges = async () => {
    if (!currentUser) return;
    try {
      const userDoc = doc(db, 'users', currentUser.uid);
      await updateDoc(userDoc, {
        ...profileData,
        ...(isPasswordChanging && { password }), // Solo agrega la contraseña si está cambiando
      });
      alert('Perfil actualizado correctamente.');
      setIsEditing(false);
      setIsPasswordChanging(false); // Reinicia el estado de cambio de contraseña
      setPassword(''); // Limpia el campo de la contraseña
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
    }
  };

  return (
    <div className="p-4 min-w-[30vw] max-w-[90vw]">
      <div className="space-y-4">
        <div>
          <label className="block font-semibold text-gray-700">Nombre de Usuario:</label>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={profileData.username}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <p className="text-gray-700">{profileData.username}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Email:</label>
          <p className="text-gray-700">{profileData.email}</p>
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Fecha de Creación:</label>
          <p className="text-gray-700">{profileData.fechaCreacion}</p>
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Teléfono:</label>
          {isEditing ? (
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
            />
          ) : (
            <p className="text-gray-700">{profileData.phone}</p>
          )}
        </div>
        <div>
          <label className="block font-semibold text-gray-700">Rol:</label>
          <p className="text-gray-700">{profileData.role}</p>
        </div>

        {/* Campo de Contraseña Condicional */}
        {isPasswordChanging && (
          <div>
            <label className="block font-semibold text-gray-700">{hasPassword ? 'Nueva Contraseña:' : 'Crear Contraseña:'}</label>
            <input
              type="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
            />
            <button
              onClick={handleSaveChanges}
              className="mt-2 bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Guardar Contraseña
            </button>
          </div>
        )}

        {/* Botón para Crear o Cambiar Contraseña */}
        <button
          className="mt-4 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
          onClick={() => setIsPasswordChanging((prev) => !prev)}
        >
          {isPasswordChanging ? 'Cancelar' : hasPassword ? 'Cambiar Contraseña' : 'Crear Contraseña'}
        </button>

        {/* Botón para Editar y Guardar cambios */}
        <div className="mt-6 flex space-x-4">
          {isEditing ? (
            <button
              onClick={handleSaveChanges}
              className="bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 transition"
            >
              Guardar Cambios
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-700 transition"
            >
              Editar Perfil
            </button>
          )}
          {isEditing && (
            <button
              onClick={() => setIsEditing(false)}
              className="bg-gray-600 text-white py-2 px-4 rounded hover:bg-gray-700 transition"
            >
              Cancelar
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
