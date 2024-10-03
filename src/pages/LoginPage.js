import React, { useState } from 'react';
import { authenticateUser } from '../utils/auth'; // Asegúrate de que esta línea sea correcta
import masoneriaImage from '../assets/masoneria.png'; // Ajusta la ruta según donde esté tu imagen
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Importa el archivo de estilos CSS

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        
        const user = authenticateUser(username, password);
        
        if (user) {
            if (user.grado === "0") { // Verifica si es el usuario master
                navigate('/admin'); // Redirige a la página del administrador
            } else {
                alert('Acceso denegado: no tiene permisos suficientes.');
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
