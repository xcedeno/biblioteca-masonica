import React, { useEffect, useState } from 'react';
import { firestore } from '../utils/firebase';

const UserManagement = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const snapshot = await firestore.collection('users').get();
      const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(usersList);
    };

    fetchUsers();
  }, []);

  const updateGrado = async (userId, newGrado) => {
    await firestore.collection('users').doc(userId).update({ grado: newGrado });
  };

  const deleteUser = async (userId) => {
    await firestore.collection('users').doc(userId).delete();
  };

  return (
    <div>
      <h2>Gestión de Usuarios</h2>
      {users.map(user => (
        <div key={user.id}>
          <p>{user.email} - Grado: {user.grado}</p>
          <button onClick={() => updateGrado(user.id, 'compañero')}>Asignar Compañero</button>
          <button onClick={() => updateGrado(user.id, 'maestro')}>Asignar Maestro</button>
          <button onClick={() => deleteUser(user.id)}>Eliminar Usuario</button>
        </div>
      ))}
    </div>
  );
};

export default UserManagement;
