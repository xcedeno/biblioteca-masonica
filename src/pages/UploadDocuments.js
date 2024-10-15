import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, MenuItem, Snackbar } from '@mui/material';
import { supabase } from '../utils/supabaseClient'; // Asegúrate de importar tu instancia de Supabase
import grades from '../utils/grades'; // Importa los grados desde grades.js

const UploadDocuments = () => {
  const [file, setFile] = useState(null);
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

  const handleFileChange = (event) => {
    setFile(event.target.files[0]); // Almacenar el archivo seleccionado
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file || !category || !minGrade) {
      setSnackbarMessage('Por favor, completa todos los campos.');
      setOpenSnackbar(true);
      return;
    }

    // Subir el archivo a Supabase Storage
    const { data, error } = await supabase.storage
      .from('documents') // Nombre de tu bucket en Supabase
      .upload(`uploads/${file.name}`, file); // Puedes cambiar la ruta si es necesario

    if (error) {
      console.error('Error al subir el archivo:', error);
      setSnackbarMessage('Error al subir el archivo.');
    } else {
      // Aquí puedes guardar los detalles del documento en tu base de datos, incluyendo la categoría y el grado mínimo
      const documentData = {
        name: file.name,
        category,
        minGrade,
        url: data.Key // URL del archivo subido
      };

      // Supón que tienes una tabla llamada 'documents' para almacenar la información
      const { error: insertError } = await supabase
        .from('documents')
        .insert([documentData]);

      if (insertError) {
        console.error('Error al insertar documento en la base de datos:', insertError);
        setSnackbarMessage('Error al guardar la información del documento.');
      } else {
        setSnackbarMessage('Documento subido y registrado correctamente.');
      }
    }

    setOpenSnackbar(true); // Abrir snackbar para mostrar mensaje
    // Limpiar el formulario
    setFile(null);
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
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          required
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Subir Documento
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
