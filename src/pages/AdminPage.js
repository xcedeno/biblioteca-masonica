import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; 
import { grades } from '../utils/grades'; 
import {
    Grid,
    Typography,
    CircularProgress,
    Button,
    TextField,
    Select,
    MenuItem,
    Container,
    Paper,
} from '@mui/material';
import './AdminPage.css';

const AdminPage = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newGrade, setNewGrade] = useState('1'); 
    const [fullName, setFullName] = useState('');
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    grade: newGrade, 
                    fullName: fullName,
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

    const resetForm = () => {
        setNewUsername('');
        setNewPassword('');
        setFullName('');
    };

    return (
        <Container maxWidth="lg" className="admin-container">
            <Typography variant="h4" align="center" gutterBottom>
                Panel de Administración
            </Typography>

            {/* Formulario de Creación de Usuario */}
            <Grid container spacing={3}>
                <Grid item xs={12} sm={6} md={4}>
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
                </Grid>

                {/* Lista de Usuarios */}
                <Grid item xs={12} sm={6} md={8}>
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
                </Grid>
            </Grid>
        </Container>
    );
};

export default AdminPage;
