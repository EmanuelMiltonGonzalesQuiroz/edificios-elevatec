import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table';
import EditButton from '../../components/UI/EditButton';
import DeleteButton from '../../components/UI/DeleteButton';
import DisableButton from '../../components/UI/DisableButton';
import EnableButton from '../../components/UI/EnableButton';
import Modal from '../../components/UI/Modal'; // Importa el componente de Modal
import AddUserModal from './AddUserModal'; // Importa el modal para agregar usuario
import { db } from '../../connection/firebase';
import { collection, getDocs } from 'firebase/firestore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersCollection = collection(db, 'users');
      const userSnapshot = await getDocs(usersCollection);
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsers(userList);
    };

    fetchUsers();
  }, []);

  const handleAddUserSuccess = (newUser) => {
    setUsers([...users, newUser]);
    setIsAddUserModalOpen(false); // Cierra el modal después de agregar el usuario
  };

  const handleUpdateSuccess = (updatedUser) => {
    setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)));
  };

  const handleDisableSuccess = (disabledUserId) => {
    setUsers(users.map((user) => (user.id === disabledUserId ? { ...user, state: 'inactive' } : user)));
  };

  const handleEnableSuccess = (enabledUserId) => {
    setUsers(users.map((user) => (user.id === enabledUserId ? { ...user, state: 'active' } : user)));
  };

  const handleDeleteSuccess = (deletedUserId) => {
    setUsers(users.filter((user) => user.id !== deletedUserId));
  };

  return (
    <div className="p-4 min-w-[60vw] text-black">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-bold">Gestión de Usuarios</h2>
        <button
          onClick={() => setIsAddUserModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          + Agregar Usuario
        </button>
      </div>

      <Table
        columnTitles={['Nombre', 'Email', 'Teléfono']}
        data={users}
        hasIndex={true}
        rowClass={(user) => (user.state === 'inactive' ? 'bg-red-200' : '')}
        buttons={[
          (props) => (
            <EditButton
              {...props}
              onUpdateSuccess={handleUpdateSuccess}
              collectionName="users"
              fieldsConfig={[
                { label: 'Nombre', name: 'username', type: 'input', editable: true, validation: /^[a-zA-Z\s]+$/ },
                { label: 'Email', name: 'email', type: 'input', editable: false },
                { label: 'Teléfono', name: 'phone', type: 'input', editable: true, validation: /^[0-9]+$/ },
                { label: 'Rol', name: 'role', type: 'select', options: ['Usuario', 'Administrador', 'Gerencia', 'Inmobiliario', 'Inmobiliario Plus', 'Cliente'], editable: true },
              ]}
            />
          ),
          (props) =>
            (props.row.state === 'active' || !props.row.state) ? (
              <DisableButton
                {...props}
                collectionName="users"
                onDisableSuccess={handleDisableSuccess}
              />
            ) : (
              <EnableButton
                {...props}
                collectionName="users"
                onEnableSuccess={handleEnableSuccess}
              />
            ),
          (props) => (
            <DeleteButton
              {...props}
              collectionName="users"
              onDeleteSuccess={handleDeleteSuccess}
            />
          ),
        ]}
      />

      {/* Modal para agregar usuario */}
      <Modal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        title="Agregar Nuevo Usuario"
      >
        <AddUserModal onAddUserSuccess={handleAddUserSuccess} />
      </Modal>
    </div>
  );
};

export default UserManagement;
