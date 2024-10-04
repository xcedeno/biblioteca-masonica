import React, { useState, useEffect } from 'react';
import { db } from '../utils/firebase';
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newGrade, setNewGrade] = useState('1'); // Default to Aprendiz (1)
    const [fullName, setFullName] = useState(''); // State for full name
    const [users, setUsers] = useState([]);
    const navigate = useNavigate();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!currentUser || currentUser.grado !== "0") {
            alert("Acceso denegado. No tienes permisos para acceder a esta página.");
            navigate('/home');
        } else {
            fetchUsers();
        }
    }, [currentUser, navigate]);

    const fetchUsers = async () => {
        const querySnapshot = await getDocs(collection(db, 'usuarios'));
        const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            await addDoc(collection(db, 'usuarios'), {
                username: newUsername,
                password: newPassword,
                grade: newGrade,
                fullName: fullName, // Include full name
                isMaster: newGrade === "0"
            });
            alert('Usuario creado exitosamente');
            setNewUsername('');
            setNewPassword('');
            setFullName(''); // Clear full name input
            fetchUsers();
        } catch (error) {
            console.error('Error al crear el usuario: ', error);
            alert('Hubo un error al crear el usuario');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await deleteDoc(doc(db, 'usuarios', userId));
            alert('Usuario eliminado exitosamente');
            fetchUsers();
        } catch (error) {
            console.error('Error al eliminar el usuario: ', error);
            alert('Hubo un error al eliminar el usuario');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const grades = [
        { value: '1', label: 'Aprendiz' },
        { value: '2', label: 'Compañero' },
        { value: '3', label: 'Maestro' },
        { value: '4', label: 'Maestro Secreto' },
        { value: '5', label: 'Maestro Perfecto' },
        { value: '6', label: 'Secretario Íntimo' },
        { value: '7', label: 'Preboste y Juez' },
        { value: '8', label: 'Intendente de los Edificios' },
        { value: '9', label: 'Maestro Elegido de los Nueve' },
        { value: '10', label: 'Ilustre Elegido de los Quince' },
        { value: '11', label: 'Sublime Caballero Elegido' },
        { value: '12', label: 'Gran Maestro Arquitecto' },
        { value: '13', label: 'Real Arco de Salomón' },
        { value: '14', label: 'Gran Elegido, Perfecto y Sublime Masón' },
        { value: '15', label: 'Caballero de Oriente' },
        { value: '16', label: 'Príncipe de Jerusalén' },
        { value: '17', label: 'Caballero de Oriente y Occidente' },
        { value: '18', label: 'Soberano Príncipe Rosacruz' },
        { value: '19', label: 'Gran Pontífice' },
        { value: '20', label: 'Venerable Gran Maestro' },
        { value: '21', label: 'Noaquita o Caballero Prusiano' },
        { value: '22', label: 'Caballero Real Hacha' },
        { value: '23', label: 'Jefe del Tabernáculo' },
        { value: '24', label: 'Príncipe del Tabernáculo' },
        { value: '25', label: 'Caballero de la Serpiente de Bronce' },
        { value: '26', label: 'Príncipe de la Misericordia' },
        { value: '27', label: 'Caballero Comendador del Templo' },
        { value: '28', label: 'Príncipe Adepto Real' },
        { value: '29', label: 'Gran Escocés de San Andrés' },
        { value: '30', label: 'Caballero Kadosh' },
        { value: '31', label: 'Gran Inspector Inquisidor Comendador' },
        { value: '32', label: 'Sublime Príncipe del Real Secreto' },
        { value: '33', label: 'Soberano Gran Inspector General' },
        { value: '0', label: 'Master (Solo uno permitido)' },
    ];

    return (
        <div className="container">
            <h1>Panel de Administración</h1>
            <form onSubmit={handleCreateUser}>
                <input
                    type="text"
                    placeholder="Nuevo nombre de usuario"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Nueva contraseña"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                />
                <input
                    type="text"
                    placeholder="Nombre completo" // New field for full name
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    required
                />
                <select value={newGrade} onChange={(e) => setNewGrade(e.target.value)}>
                    {grades.map((grade) => (
                        <option key={grade.value} value={grade.value}>
                            {grade.label}
                        </option>
                    ))}
                </select>
                <button type="submit">Crear Usuario</button>
            </form>

            <h2>Lista de Usuarios</h2>
            <table>
                <thead>
                    <tr>
                        <th>Nombre de Usuario</th>
                        <th>Nombre Completo</th> {/* New column for full name */}
                        <th>Grado</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr key={user.id}>
                            <td>{user.username}</td>
                            <td>{user.fullName}</td> {/* Display full name */}
                            <td>{grades.find(grade => grade.value === user.grade)?.label}</td>
                            <td>
                                <button style={{ backgroundColor: '#ffc107' }}>Editar</button>
                                <button style={{ backgroundColor: '#dc3545' }} onClick={() => handleDeleteUser(user.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className="logout-button" onClick={handleLogout}>Cerrar Sesión</button>
        </div>
    );
};

export default AdminPage;
