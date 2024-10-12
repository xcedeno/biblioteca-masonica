import React, { useState } from 'react';
import { supabase } from '../utils/supabaseClient'; // Importa el cliente de Supabase
import masoneriaImage from '../assets/masoneria.png';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const authenticateUser = async (username, password) => {
        try {
            const { data, error } = await supabase
                .from('users') // La tabla de usuarios
                .select('*')
                .eq('username', username)
                .single(); // Obtiene un único registro

            if (error) throw error; // Lanza error si ocurre

            // Comprobar la contraseña
            if (data && data.password === password) {
                return data; // Usuario autenticado correctamente
            } else {
                return null; // Contraseña incorrecta
            }

        } catch (error) {
            console.error('Error during authentication:', error);
            return null;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();

        const user = await authenticateUser(username, password);
        
        console.log("Usuario autenticado:", user); // Log para ver el usuario autenticado

        if (user) {
            // Almacenar el usuario en localStorage
            localStorage.setItem('currentUser', JSON.stringify(user));

            // Verifica el grado y redirige según el tipo de usuario
            console.log("Grado del usuario:", user.grade); // Log para ver el grado

            if (user.grade === 'master' || user.grade === '0') { // Verifica el valor correcto de grado
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
