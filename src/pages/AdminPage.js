import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient';
import { grades } from '../utils/grades';
import {
    Grid2,
    Typography,
    CircularProgress,
    Button,
    TextField,
    Select,
    MenuItem,
    Container,
    Paper,
} from '@mui/material';
import { Drawer, Menu } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import './AdminPage.css';

const AdminPage = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newGrade, setNewGrade] = useState('1');
    const [fullName, setFullName] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [drawerVisible, setDrawerVisible] = useState(true);
    const navigate = useNavigate();
    const location = useLocation(); // Para obtener la ruta actual

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

    const handleMenuClick = (path) => {
        setLoading(true);
        setTimeout(() => {
            navigate(path);
            setLoading(false);
        }, 1000);
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            const { error } = await supabase.from('users').insert([{
                username: newUsername,
                password: newPassword, 
                grade: newGrade, 
                fullName: fullName,
            }]);
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

    const resetForm = () => {
        setNewUsername('');
        setNewPassword('');
        setFullName('');
        setNewGrade('1');
    };

    const showDrawer = () => {
        setDrawerVisible(true);
    };

    const closeDrawer = () => {
        setDrawerVisible(false);
    };

    // Solo mostrar el contenido de "Crear Usuarios" si la ruta es "/admin"
    const shouldShowCreateUserContent = location.pathname === '/admin';

    return (
        <Container maxWidth="lg" className="admin-container">
            <Typography variant="h4" align="center" gutterBottom>
                Panel de Administración
            </Typography>

            <Button type="primary" onClick={showDrawer}>
                Menú
            </Button>

            <Drawer
                title="Menú de Opciones"
                placement="left"
                closable={true}
                onClose={closeDrawer}
                open={drawerVisible}
                width={200}
                style={{ padding: 0 }}
            >
                <Menu
                    mode="inline"
                    defaultSelectedKeys={['1']}
                    style={{ height: '100%', borderRight: 0 }}
                >
                    <Menu.Item key="1" onClick={() => handleMenuClick('/admin')}>
                        Crear Usuarios
                    </Menu.Item>
                    <Menu.Item key="2" onClick={() => handleMenuClick('/admin/create-categories')}>
                        Crear Categorías
                    </Menu.Item>
                    <Menu.Item key="3" onClick={() => handleMenuClick('/admin/upload-documents')}>
                        Subir Documentos
                    </Menu.Item>
                </Menu>
            </Drawer>

            {/* Mostrar contenido de Crear Usuarios si la ruta es "/admin" */}
            {shouldShowCreateUserContent && (
                <Grid2 container spacing={3}>
                    <Grid2 item xs={12} sm={6} md={4}>
                        <Paper elevation={3} style={{ padding: '20px' }}>
                            <form onSubmit={handleCreateUser}>
                                <Typography variant="h6" gutterBottom>
                                    Crear Nuevo Usuario
                                </Typography>
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Nuevo nombre de usuario"
                                    value={newUsername}
                                    onChange={(e) => setNewUsername(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Nueva contraseña"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    required
                                />
                                <TextField
                                    fullWidth
                                    margin="normal"
                                    label="Nombre completo"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    required
                                />
                                <Select
                                    fullWidth
                                    margin="normal"
                                    value={newGrade}
                                    onChange={(e) => setNewGrade(e.target.value)}
                                    displayEmpty
                                >
                                    {grades.map((grade) => (
                                        <MenuItem key={grade.value} value={grade.value}>
                                            {grade.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <Button variant="contained" color="primary" type="submit" fullWidth>
                                    Crear Usuario
                                </Button>
                            </form>
                        </Paper>
                    </Grid2>

                    <Grid2 item xs={12} sm={6} md={8}>
                        <Typography variant="h6">Lista de Usuarios</Typography>
                        {loading ? (
                            <CircularProgress />
                        ) : (
                            <table className="user-table">
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
                                                <Button 
                                                    variant="outlined" 
                                                    color="primary" 
                                                    size="small" 
                                                    style={{ marginRight: '10px' }}
                                                >
                                                    Editar
                                                </Button>
                                                <Button
                                                    variant="outlined"
                                                    color="secondary"
                                                    size="small"
                                                    onClick={() => handleDeleteUser(user.id)}
                                                >
                                                    Eliminar
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                    </Grid2>
                </Grid2>
            )}

            {loading ? (
                <CircularProgress style={{ position: 'absolute', top: '50%', left: '50%' }} />
            ) : (
                <Outlet />
            )}
        </Container>
    );
};

export default AdminPage;
