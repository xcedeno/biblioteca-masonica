import React, { useState } from 'react';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import masoneriaImage from '../assets/masoneria.png';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const authenticateUser = async (username, password) => {
        try {
            const usersCollection = collection(db, 'usuarios');
            const masterCollection = collection(db, 'users');

            // Verificar si el usuario existe en la colección de usuarios
            const userQuery = query(usersCollection, where('username', '==', username));
            const userSnapshot = await getDocs(userQuery);

            if (!userSnapshot.empty) {
                const userDoc = userSnapshot.docs[0];
                const userData = userDoc.data();

                // Comprobar la contraseña
                if (userData.password === password) {
                    return userData; // Usuario autenticado correctamente
                } else {
                    return null; // Contraseña incorrecta
                }
            }

            // Verificar si el usuario existe en la colección de masters
            const masterQuery = query(masterCollection, where('username', '==', username));
            const masterSnapshot = await getDocs(masterQuery);

            if (!masterSnapshot.empty) {
                const masterDoc = masterSnapshot.docs[0];
                const masterData = masterDoc.data();

                // Comprobar la contraseña para el master
                if (masterData.password === password) {
                    return { ...masterData, isMaster: true }; // Master autenticado correctamente
                } else {
                    return null; // Contraseña incorrecta
                }
            }

            return null; // Usuario no encontrado en ninguna colección

        } catch (error) {
            console.error('Error during authentication:', error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = await authenticateUser(username, password);

        if (user) {
            // Almacenar el usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Redirigir según el tipo de usuario
            if (user.isMaster) {
                navigate('/admin', { state: { userGrade: user.grade } });
            } else if (user.grade === '0') {
                navigate('/admin');
            } else {
                navigate('/home', { state: { userGrade: user.grade } });
            }
        } else {
            alert('Usuario o contraseña incorrectos');
        }
    };

    return (
        <div className="login-container">
            <img src={masoneriaImage} alt="Masonería" className="masoneria-image" />
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleLogin}>
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
                <button type="submit">Iniciar Sesión</button>
            </form>
        </div>
    );
};

export default LoginPage;
