import React, { useState, useEffect } from 'react';
import { db, storage } from '../utils/firebase'; // Importa Firebase storage
import { collection, addDoc, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'; // Importa métodos de Firebase Storage
import { useNavigate } from 'react-router-dom';
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
    IconButton,
    AppBar,
    Toolbar,
    Typography,
    Divider
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import './AdminPage.css';

const AdminPage = () => {
    const [newUsername, setNewUsername] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [newGrade, setNewGrade] = useState('1'); // Default to Aprendiz (1)
    const [fullName, setFullName] = useState(''); // State for full name
    const [profileImage, setProfileImage] = useState(null); // State para la imagen de perfil
    const [imagePreview, setImagePreview] = useState(null); // State para la vista previa de la imagen
    const [users, setUsers] = useState([]);
    const [drawerOpen, setDrawerOpen] = useState(false); // State for drawer open/close
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
        try {
            const querySnapshot = await getDocs(collection(db, 'usuarios'));
            const usersList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        } catch (error) {
            console.error('Error al obtener los usuarios: ', error);
            alert('Hubo un error al obtener los usuarios');
        }
    };

    // Manejo de subida de imagen a Firebase Storage
    const uploadImage = async (file) => {
        if (!file) return null;
        const storageRef = ref(storage, `profileImages/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        return downloadURL;
    };

    const handleCreateUser = async (e) => {
        e.preventDefault();
        try {
            // Subir imagen de perfil si está seleccionada
            const profileImageUrl = profileImage ? await uploadImage(profileImage) : null;

            await addDoc(collection(db, 'usuarios'), {
                username: newUsername,
                password: newPassword,
                grade: newGrade,
                fullName: fullName, // Include full name
                profileImage: profileImageUrl, // URL de la imagen de perfil
                isMaster: newGrade === "0"
            });
            alert('Usuario creado exitosamente');
            setNewUsername('');
            setNewPassword('');
            setFullName('');
            setProfileImage(null); // Limpiar el input de imagen
            setImagePreview(null); // Limpiar la vista previa
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

    const toggleDrawer = (open) => (event) => {
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setDrawerOpen(open);
    };

    const handleMenuClick = (option) => {
        switch (option) {
            case 'addUser':
                navigate('/admin');
                break;
            case 'addCategory':
                navigate('/home');
                break;
            case 'addBook':
                alert('Ir a agregar libro');
                break;
            default:
                break;
        }
        setDrawerOpen(false);
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
    ];

    // Función para manejar el cambio de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(file);
            setImagePreview(URL.createObjectURL(file)); // Crea la vista previa
        } else {
            setProfileImage(null);
            setImagePreview(null); // Limpiar vista previa si no hay archivo
        }
    };

    return (
        <div className="container">
            {/* AppBar con el botón de menú */}
            <AppBar position="static">
                <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <IconButton
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    
                </Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1, textAlign: 'center' }}>
                        Panel de Administración
                    </Typography>
                
            </AppBar>

            {/* Drawer de navegación */}
            <Drawer anchor="left" open={drawerOpen} onClose={toggleDrawer(false)}>
                <div
                    role="presentation"
                    onClick={toggleDrawer(false)}
                    onKeyDown={toggleDrawer(false)}
                    style={{ width: 250 }}
                >
                    <List>
                        <ListItem button onClick={() => handleMenuClick('addUser')}>
                            <ListItemText primary="Agregar Usuario" />
                        </ListItem>
                        <ListItem button onClick={() => handleMenuClick('addCategory')}>
                            <ListItemText primary="Agregar Categoría" />
                        </ListItem>
                        <ListItem button onClick={() => handleMenuClick('addBook')}>
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

            {/* Contenido Principal */}
            <div className="content">
                <form onSubmit={handleCreateUser} className="create-user-form">
                    <h2>Crear Nuevo Usuario</h2>
                    {/* Input para cargar la imagen de perfil */}
                <label>Imagen de perfil:</label>
                <div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange} // Manejo del cambio de imagen
                    />
                </div>
                {imagePreview && (
                    <div>
                        <h4>Vista Previa de la Imagen:</h4>
                        <img src={imagePreview} alt="Vista previa" style={{ width: '100px', height: '100px' }} />
                    </div>
                )}
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
            </div>
        </div>
    );
};

export default AdminPage;
