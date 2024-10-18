import React, { useState, useEffect } from 'react';
import { Typography, Container, TextField, Button, MenuItem, Snackbar, Table, TableHead, TableBody, TableRow, TableCell, IconButton } from '@mui/material';
import { Edit, Delete } from '@mui/icons-material'; // Íconos para editar y eliminar
import { supabase } from '../utils/supabaseClient'; // Asegúrate de importar tu instancia de Supabase
import grades from '../utils/grades'; // Importa los grados desde grades.js

const UploadDocuments = () => {
  const [fileUrl, setFileUrl] = useState(''); // URL del archivo subido a TeraBox
  const [documentName, setDocumentName] = useState(''); // Nuevo campo para el nombre del documento
  const [category, setCategory] = useState('');
  const [minGrade, setMinGrade] = useState('');
  const [categories, setCategories] = useState([]);
  const [documents, setDocuments] = useState([]); // Almacenar los documentos
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Obtener categorías desde Supabase
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

  // Función para obtener documentos
  const fetchDocuments = async () => {
    const { data, error } = await supabase
      .from('documents')
      .select('id, name, category_id, minGrade, url, created_at');
    if (error) {
      console.error('Error al obtener documentos:', error);
    } else {
      setDocuments(data);
    }
  };

  // Obtener documentos cuando se carga el componente
  useEffect(() => {
    fetchDocuments();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!documentName || !fileUrl || !category || !minGrade) {
      setSnackbarMessage('Por favor, completa todos los campos.');
      setOpenSnackbar(true);
      return;
    }

    // Encontrar la categoría seleccionada por nombre
    const selectedCategory = categories.find(cat => cat.name === category);

    if (!selectedCategory) {
      setSnackbarMessage('Categoría seleccionada no válida.');
      setOpenSnackbar(true);
      return;
    }

    // Guardar el documento en la base de datos
    const documentData = {
      name: documentName,  // Usamos el nombre del documento proporcionado por el usuario
      category_id: selectedCategory.id,
      minGrade,
      url: fileUrl
    };

    const { error: insertError } = await supabase.from('documents').insert([documentData]);

    if (insertError) {
      console.error('Error al insertar documento en la base de datos:', insertError.message);
      setSnackbarMessage('Error al guardar la información del documento.');
    } else {
      setSnackbarMessage('Documento registrado correctamente.');
      fetchDocuments(); // Recargar la tabla de documentos después de insertar
    }

    setOpenSnackbar(true);
    setFileUrl('');
    setDocumentName('');  // Limpiar el campo nombre
    setCategory('');
    setMinGrade('');
  };

  const handleDelete = async (id) => {
    const { error } = await supabase.from('documents').delete().eq('id', id);
    if (error) {
      console.error('Error al eliminar documento:', error.message);
      setSnackbarMessage('Error al eliminar el documento.');
    } else {
      setSnackbarMessage('Documento eliminado correctamente.');
      setDocuments(documents.filter(doc => doc.id !== id)); // Actualiza la lista de documentos
    }
    setOpenSnackbar(true);
  };
  // Función para extraer la ID de Google Drive
const extractDriveId = (url) => {
  const regex = /\/d\/(.+?)\//; // Expresión regular para encontrar la ID en la URL
  const match = url.match(regex);
  return match ? match[1] : null; // Si coincide, devuelve la ID, de lo contrario null
};

// Modificar el manejador de cambios en el campo URL del archivo
const handleFileUrlChange = (e) => {
  const fullUrl = e.target.value;
  const driveId = extractDriveId(fullUrl); // Extraer la ID del enlace de Google Drive
  setFileUrl(driveId); // Guardar solo la ID
};


  const handleEdit = (id) => {
    // Aquí puedes implementar la lógica para editar un documento
    // Podrías rellenar los campos del formulario con los datos del documento seleccionado
    console.log('Editar documento con id:', id);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Subir Documentos
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Nombre del Documento"
          value={documentName}
          onChange={(e) => setDocumentName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />
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
          label="URL del archivo (Google Drive)"
          value={fileUrl}
          onChange={handleFileUrlChange}
          fullWidth
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '16px' }}>
          Registrar Documento
        </Button>
      </form>

      {/* Mostrar tabla de documentos */}
      <Typography variant="h5" gutterBottom style={{ marginTop: '32px' }}>
        Documentos Subidos
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Categoría</TableCell>
            <TableCell>Grado Mínimo</TableCell>
            <TableCell>Fecha de Creación</TableCell>
            <TableCell>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {documents.map((doc) => (
            <TableRow key={doc.id}>
              <TableCell>{doc.name}</TableCell>
              <TableCell>{categories.find(cat => cat.id === doc.category_id)?.name}</TableCell>
              <TableCell>{doc.minGrade}</TableCell>
              <TableCell>{new Date(doc.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                <IconButton onClick={() => handleEdit(doc.id)}>
                  <Edit />
                </IconButton>
                <IconButton onClick={() => handleDelete(doc.id)}>
                  <Delete />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

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
