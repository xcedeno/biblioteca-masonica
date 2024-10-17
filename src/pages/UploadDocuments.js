import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, MenuItem, Snackbar } from '@mui/material';
import { supabase } from '../utils/supabaseClient'; // Asegúrate de importar tu instancia de Supabase
import grades from '../utils/grades'; // Importa los grados desde grades.js

const UploadDocuments = () => {
  const [fileUrl, setFileUrl] = useState(''); // URL del archivo subido a TeraBox
  const [category, setCategory] = useState('');
  const [minGrade, setMinGrade] = useState('');
  const [categories, setCategories] = useState([]);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Obtener categorías desde Supabase (si ya tienes una tabla de categorías)
  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase.from('categories').select('*');
      if (error) {
        console.error('Error al obtener categorías:', error);
      } else {
        setCategories(data);
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!fileUrl || !category || !minGrade) {
      setSnackbarMessage('Por favor, completa todos los campos.');
      setOpenSnackbar(true);
      return;
    }
  
    // Find the selected category by name to get its ID
    const selectedCategory = categories.find(cat => cat.name === category);
  
    if (!selectedCategory) {
      setSnackbarMessage('Categoría seleccionada no válida.');
      setOpenSnackbar(true);
      return;
    }
  
    // Guardar el enlace compartido de TeraBox en la base de datos de Supabase
    const documentData = {
      name: fileUrl.split('/').pop(), // Nombre del archivo
      category_id: selectedCategory.id, // Use category_id instead of category name
      minGrade,
      url: fileUrl // Enlace del archivo subido a TeraBox
    };
  
    const { error: insertError } = await supabase.from('documents').insert([documentData]);
  
    if (insertError) {
      console.error('Error al insertar documento en la base de datos:', insertError.message, insertError.details, insertError.hint);
      setSnackbarMessage('Error al guardar la información del documento.');
    } else {
      setSnackbarMessage('Documento registrado correctamente.');
    }
  
    setOpenSnackbar(true); // Abrir snackbar para mostrar mensaje
    setFileUrl(''); // Limpiar campos
    setCategory('');
    setMinGrade('');
  };
  

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Subir Documentos
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          select
          label="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          {categories.map((cat) => (
            <MenuItem key={cat.id} value={cat.name}>
              {cat.name}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          select
          label="Grado Mínimo"
          value={minGrade}
          onChange={(e) => setMinGrade(e.target.value)}
          fullWidth
          margin="normal"
          required
        >
          {grades.map((grade) => (
            <MenuItem key={grade.value} value={grade.value}>
              {grade.label}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="URL del archivo (TeraBox)"
          value={fileUrl}
          onChange={(e) => setFileUrl(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Registrar Documento
        </Button>
      </form>

      {/* Snackbar para mostrar mensajes */}
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={() => setOpenSnackbar(false)}
        message={snackbarMessage}
      />
    </Container>
  );
};

export default UploadDocuments;
