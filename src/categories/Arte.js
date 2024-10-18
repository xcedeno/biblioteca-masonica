import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid2 } from '@mui/material';
import { supabase } from '../utils/supabaseClient';
import BookCard from '../components/BookCard'; // Asegúrate de importar BookCard

const CategoryView = () => {
  const [books, setBooks] = useState([]);
  const [artCategory, setArtCategory] = useState(null);

  // Obtener libros y la categoría de arte desde la base de datos
  useEffect(() => {
    const fetchBooks = async () => {
      const { data, error } = await supabase.from('documents').select('*');
      if (error) {
        console.error('Error al obtener libros:', error);
      } else {
        setBooks(data);
      }
    };

    const fetchArtCategory = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('name', 'Arte'); // Asegúrate de que este filtro coincida con el nombre exacto de la categoría de "Arte"
      
      if (error) {
        console.error('Error al obtener la categoría de arte:', error);
      } else if (data.length > 0) {
        setArtCategory(data[0]); // Suponiendo que solo hay una categoría de "Arte"
      }
    };

    fetchBooks();
    fetchArtCategory();
  }, []);

  return (
    <Container>
      {artCategory && (
        <div key={artCategory.id}>
          <Typography variant="h4" gutterBottom>{artCategory.name}</Typography>
          <Grid2 container spacing={2}>
            {books
              .filter(book => book.category_id === artCategory.id) // Filtrar libros por categoría de "Arte"
              .map(book => (
                <Grid2 item key={book.id}>
                  <BookCard book={book} />
                </Grid2>
              ))}
          </Grid2>
        </div>
      )}
    </Container>
  );
};

export default CategoryView;
