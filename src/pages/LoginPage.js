import React, { useState } from 'react';
import { authenticateUser } from '../utils/auth'; // Importa la autenticación desde Firestore
import masoneriaImage from '../assets/masoneria.png'; // Asegúrate de que la ruta de la imagen sea correcta
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Asegúrate de tener el archivo CSS

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        const user = await authenticateUser(username, password); // Asegúrate de usar await
        
        if (user) {
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            if (user.grado === "0") {
                navigate('/admin'); // Redirige a la página del administrador
            } else {
                navigate('/home'); // Redirige a la página de inicio
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
