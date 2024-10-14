import React, { useState, useEffect } from 'react';
import { supabase } from '../utils/supabaseClient'; // Supabase instance
import {
    Button, TextField, Select, MenuItem, InputLabel, FormControl, Table,
    TableBody, TableCell, TableHead, TableRow, Paper, IconButton
} from '@mui/material';
import { grades } from '../utils/grades';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

const CreateCategories = () => {
    const [categoryName, setCategoryName] = useState('');
    const [image, setImage] = useState(null);
    const [minGrade, setMinGrade] = useState('aprendiz');
    const [imagePreview, setImagePreview] = useState('');
    const [categories, setCategories] = useState([]);
    const [editingCategory, setEditingCategory] = useState(null); // Track editing


    useEffect(() => {
        fetchCategories();
    }, []);


     // Fetch categories from Supabase
    const fetchCategories = async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*');
        
        if (error) {
            console.error('Error fetching categories:', error);
        } else {
            setCategories(data);
        }
    };

    // Función para obtener el UID del usuario maestro
    const fetchMasterUser = async () => {
        const { data, error } = await supabase
            .from('users')
            .select('id')
            .eq('username', 'master') // Ajusta según tu lógica
            .single();
        
        if (error) {
            console.error('Error fetching master user:', error);
            return null;
        }
        return data?.id; // Retorna el UID del usuario maestro
    };

    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImage(file);
            setImagePreview(URL.createObjectURL(file)); // Show image preview
        }
    };

    const handleCreateCategory = async (e) => {
        e.preventDefault();

        if (!categoryName || !image) {
            alert('Por favor, llena todos los campos y selecciona una imagen.');
            return;
        }

        const masterUID = await fetchMasterUser();
        if (!masterUID) {
            alert('No se pudo obtener el usuario maestro.');
            return;
        }

        // Upload image to Supabase storage
                    const { data: uploadData, error: uploadError } = await supabase
                .storage
                .from('images')
                .upload(`categories/${image.name}`, image);

            if (uploadError) {
                console.error('Error uploading image:', uploadError.message);
                alert(`Error al subir la imagen: ${uploadError.message}`);
                return;
            }

            // Asegúrate de que uploadData esté definido
            if (!uploadData) {
                console.error('Upload data is null:', uploadData);
                alert('No se pudo obtener la información de la carga.');
                return;
            }

            // Obtener la URL pública de la imagen cargada
            const { data: { publicURL }, error: publicUrlError } = supabase
                .storage
                .from('images')
                .getPublicUrl(`categories/${image.name}`);

            if (publicUrlError) {
                console.error('Error getting public URL:', publicUrlError.message);
                alert(`Error al obtener la URL de la imagen: ${publicUrlError.message}`);
                return;
            }

            // Verifica qué contiene uploadData
            console.log('Upload Data:', uploadData); // Agrega esta línea

            // Verifica que uploadData tenga una propiedad path
            if (uploadData && uploadData.path) {
                const { data: { publicURL }, error: publicUrlError } = supabase
                    .storage
                    .from('images')
                    .getPublicUrl(uploadData.path);

                if (publicUrlError) {
                    console.error('Error getting public URL:', publicUrlError.message);
                    alert(`Error al obtener la URL de la imagen: ${publicUrlError.message}`);
                    return;
                }

                console.log('Public URL:', publicURL); // Verifica la URL pública
            } else {
                console.error('Upload data does not contain a valid path');
            }




        // Insert the category with the image URL
        const { error: insertError } = await supabase
            .from('categories')
            .insert([{
                name: categoryName,
                image_url: publicURL, // Use the public URL of the image
                min_grade: minGrade,
                //id: masterUID // Usar el UID correcto
            }]);

        if (insertError) {
            console.error('Error inserting category:', insertError.message);
            alert(`Error al crear la categoría: ${insertError.message}`);
        } else {
            alert('Categoría creada exitosamente.');
            setCategoryName('');
            setImage(null);
            setImagePreview('');
            setMinGrade('aprendiz');
        }
    };

     // Delete category function
     const handleDeleteCategory = async (categoryId) => {
        const { error } = await supabase.from('categories').delete().eq('id', categoryId);
        if (error) {
            console.error('Error deleting category:', error.message);
        } else {
            alert('Categoría eliminada exitosamente.');
            fetchCategories(); // Refresh the categories after deletion
        }
    };

    // Edit category function
    const handleEditCategory = (category) => {
        setCategoryName(category.name);
        setMinGrade(category.min_grade);
        setImagePreview(category.image_url);
        setEditingCategory(category); // Set the category to be edited
    };


    return (
        <>
            <form onSubmit={handleCreateCategory}>
                <TextField
                    label="Nombre de la Categoría"
                    value={categoryName}
                    onChange={(e) => setCategoryName(e.target.value)}
                    fullWidth
                    margin="normal"
                    required
                />
                <FormControl fullWidth margin="normal">
                    <InputLabel>Grado Mínimo</InputLabel>
                    <Select
                        value={minGrade}
                        onChange={(e) => setMinGrade(e.target.value)}
                        required
                    >
                        {grades.map((grade) => (
                            <MenuItem key={grade.value} value={grade.value}>
                                {grade.label}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {imagePreview && <img src={imagePreview} alt="Preview" style={{ width: '100%', marginTop: '10px' }} />}
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    style={{ marginTop: '20px' }}
                >
                    {editingCategory ? 'Actualizar Categoría' : 'Crear Categoría'}
                </Button>
            </form>

            <Paper style={{ marginTop: '30px', padding: '20px' }}>
                <h2>Categorías Creadas</h2>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Grado Mínimo</TableCell>
                            <TableCell>Imagen</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {categories.map((category) => (
                            <TableRow key={category.id}>
                                <TableCell>{category.name}</TableCell>
                                <TableCell>{category.min_grade}</TableCell>
                                <TableCell>
                                    <img src={category.image_url} alt={category.name} style={{ width: '100px' }} />
                                </TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleEditCategory(category)}>
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton onClick={() => handleDeleteCategory(category.id)}>
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Paper>
        </>
    );
};

export default CreateCategories;