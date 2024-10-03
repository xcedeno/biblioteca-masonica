import React, { useState } from 'react';
import Modal from 'react-modal';
import { useNavigate } from 'react-router-dom';
import grades from '../utils/grades';
import { getUsers, addUser,  } from '../utils/auth'; // Importa addUser, getUsers y authenticateUser
import './AdminPage.css';
import masoneriaImage from '../assets/masoneria.png';

Modal.setAppElement('#root');

const AdminPage = () => {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [fullName, setFullName] = useState('');
    const [password, setPassword] = useState('');
    const [grado, setGrado] = useState('');
    const [editingIndex, setEditingIndex] = useState(null); 
    const [users, setUsers] = useState(getUsers()); // Fetch the users from utils.js
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Función para verificar el usuario actual
    const checkCurrentUser = () => {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        return currentUser && currentUser.grado === '0'; // Verifica si es el usuario maestro
    };

    const handleCreateUser = (e) => {
        e.preventDefault();

        if (!checkCurrentUser()) {
            alert('No tienes permisos para crear usuarios');
            return;
        }

        const existingUser = users.find(user => user.username === username);
        if (existingUser) {
            alert('El usuario ya existe');
            return;
        }

        const newUser = {
            username,
            fullName,
            password,
            grado: parseInt(grado)
        };

        addUser(newUser); // Añade el nuevo usuario a la lista en utils.js
        setUsers(getUsers()); // Actualiza el estado con la nueva lista de usuarios

        // Reinicia los campos del formulario
        setUsername('');
        setPassword('');
        setGrado('');
        setFullName('');

        alert('Usuario creado con éxito');
    };

    const handleOpenModal = (index) => {
        const user = users[index];
        setUsername(user.username);
        setFullName(user.fullName);
        setPassword(user.password);
        setGrado(user.grado);
        setEditingIndex(index);
        setIsModalOpen(true); // Abre el modal
    };

    const handleCloseModal = () => {
        setIsModalOpen(false); // Cierra el modal
        setEditingIndex(null); // Limpia el índice de edición
    };

    const handleEditUser = (e) => {
        e.preventDefault();

        const updatedUsers = [...users];
        updatedUsers[editingIndex] = { username, fullName, password, grado: parseInt(grado) };
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        setIsModalOpen(false); // Cierra el modal después de la edición
        alert('Usuario actualizado con éxito');
    };

    const handleDeleteUser = (index) => {
        const updatedUsers = users.filter((_, i) => i !== index);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        alert('Usuario eliminado con éxito');
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        alert('Has cerrado sesión');
        navigate('/login'); // Redirigir a la página de login
    };

    return (
        <div className="container">
            <img src={masoneriaImage} alt="Masonería" className="masoneria-image" />
            <h2>Crear Nuevo Usuario</h2>
            <form onSubmit={handleCreateUser}>
                <input
                    type="text"
                    placeholder="Nombre completo"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Nombre de usuario"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <select
                    value={grado}
                    onChange={(e) => setGrado(e.target.value)}
                    required
                >
                    <option value="" disabled>Selecciona Grado</option>
                    {grades.map((grade) => (
                        <option key={grade.number} value={grade.number}>
                            {grade.name}
                        </option>
                    ))}
                </select>
                <button type="submit">Crear Usuario</button>
            </form>

            <div className="user-list">
                <h3>Usuarios Agregados</h3>
                <table className="user-table">
                    <thead>
                        <tr>
                            <th>Nombre Completo</th>
                            <th>Nombre de Usuario</th>
                            <th>Grado</th>
                            <th>Acciones</th> {/* Nueva columna para botones de acciones */}
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user, index) => (
                            <tr key={index}>
                                <td>{user.fullName}</td>
                                <td>{user.username}</td>
                                <td>{user.grado}</td>
                                <td>
                                    <button onClick={() => handleOpenModal(index)} className="edit-button">Editar</button>
                                    <button onClick={() => handleDeleteUser(index)} className="delete-button">Eliminar</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal para editar el usuario */}
            <Modal
                isOpen={isModalOpen}
                onRequestClose={handleCloseModal}
                contentLabel="Editar Usuario"
                className="Modal"
                overlayClassName="Overlay"
            >
                <h2>Editar Usuario</h2>
                <form onSubmit={handleEditUser}>
                    <input
                        type="text"
                        placeholder="Nombre completo"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Nombre de usuario"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <select
                        value={grado}
                        onChange={(e) => setGrado(e.target.value)}
                        required
                    >
                        <option value="" disabled>Selecciona Grado</option>
                        {grades.map((grade) => (
                            <option key={grade.number} value={grade.number}>
                                {grade.name}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Actualizar Usuario</button>
                </form>
                <button onClick={handleCloseModal} className="close-modal-button">Cerrar</button>
            </Modal>

            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
        </div>
    );
};

export default AdminPage;
