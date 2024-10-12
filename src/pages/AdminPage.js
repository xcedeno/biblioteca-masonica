import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; 
import { useNavigate } from 'react-router-dom';
import { grades } from '../utils/grades'; // Importa los grados
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Divider,
    CircularProgress
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './AdminPage.css';

const AdminPage = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newGrade, setNewGrade] = useState('1'); // Default to Aprendiz (1)
    const [fullName, setFullName] = useState('');
    //const [profileImage, setProfileImage] = useState(null);
    const [users, setUsers] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data, error } = await supabase.from('users').select('*');
            if (error) throw error;
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
            alert('Hubo un error al obtener los usuarios');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('users').insert([
                {
                    username: newUsername,
                    password: newPassword, 
                    grade: newGrade, // Guardamos el número correspondiente al grado
                    fullName: fullName,
                    //profileImage: profileImage
                }
            ]);
            if (error) throw error;
            alert('Usuario creado exitosamente');
            resetForm();
            fetchUsers();
        } catch (error) {
            console.error('Error creating user:', error);
            alert('Hubo un error al crear el usuario');
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const { error } = await supabase.from('users').delete().eq('id', userId);
            if (error) throw error;
            alert('Usuario eliminado exitosamente');
            fetchUsers();
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Hubo un error al eliminar el usuario');
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/login');
    };

    const resetForm = () => {
        setNewUsername('');
        setNewPassword('');
        setFullName('');
        //setProfileImage(null);
    };

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    return (
        <div className="container">
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton edge="start" color="inherit" aria-label="menu" onClick={toggleDrawer(true)}>
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
                        Panel de Administración
                    </Typography>
                </Toolbar>
            </AppBar>

            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <div role="presentation" onClick={toggleDrawer(false)} onKeyDown={toggleDrawer(false)} style={{ width: 250 }}>
                    <List>
                        <ListItem button onClick={() => navigate('/admin')}>
                            <ListItemText primary="Agregar Usuario" />
                        </ListItem>
                        <ListItem button onClick={() => navigate('/home')}>
                            <ListItemText primary="Agregar Categoría" />
                        </ListItem>
                        <ListItem button onClick={() => alert('Ir a agregar libro')}>
                            <ListItemText primary="Agregar Libro" />
                        </ListItem>
                    </List>
                    <Divider />
                    <List>
                        <ListItem button onClick={handleLogout}>
                            <ListItemText primary="Cerrar Sesión" />
                        </ListItem>
                    </List>
                </div>
            </Drawer>

            <div className="content">
                <form onSubmit={handleCreateUser} className="create-user-form">
                    <h2>Crear Nuevo Usuario</h2>
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
                        placeholder="Nombre completo"
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
                {loading ? (
                    <CircularProgress />
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Nombre de Usuario</th>
                                <th>Nombre Completo</th>
                                <th>Grado</th>
                                <th>Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((user) => (
                                <tr key={user.id}>
                                    <td>{user.username}</td>
                                    <td>{user.fullName}</td>
                                    <td>{grades.find(grade => grade.value === user.grade)?.label}</td>
                                    <td>
                                        <button className='edit-button'>Editar</button>
                                        <button
                                            className='delete-button'
                                            onClick={() => handleDeleteUser(user.id)}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
};

export default AdminPage;
