import React, { useEffect, useState } from 'react';
import Table from '../../components/UI/Table';
import EditButton from '../../components/UI/EditButton';
import DeleteButton from '../../components/UI/DeleteButton';
import DisableButton from '../../components/UI/DisableButton';
import EnableButton from '../../components/UI/EnableButton'; // Importa el nuevo botón
import { db } from '../../connection/firebase';
import { collection, getDocs } from 'firebase/firestore';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editFieldsConfig] = useState([
    { label: 'Nombre', name: 'username', type: 'input', editable: true, validation: /^[a-zA-Z\s]+$/ },
    { label: 'Email', name: 'email', type: 'input', editable: false }, // Solo lectura
    { label: 'Teléfono', name: 'phone', type: 'input', editable: true, validation: /^[0-9]+$/ },
    { label: 'Rol', name: 'role', type: 'select', options: ['Usuario', 'Administrador', 'Gerencia', 'Inmobiliario', 'Inmobiliario Plus', 'Cliente'], editable: true },
  ]);

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
      <Table
        columnTitles={['Nombre', 'Email', 'Teléfono']}
        data={users}
        hasIndex={true}
        rowClass={(user) => (user.state === 'inactive' ? 'bg-red-200' : '')} // Aplica la clase condicionalmente
        buttons={[
          (props) => (
            <EditButton
              {...props}
              onUpdateSuccess={handleUpdateSuccess}
              collectionName="users"
              fieldsConfig={editFieldsConfig}
            />
          ),
          (props) =>
            (props.row.state === 'active'  || !props.row.state) ? (
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
    </div>
  );
};

export default UserManagement;
