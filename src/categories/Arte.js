import React, { useEffect, useState } from 'react';
import arteBooks from '../utils/arteBooks'; // Importar los libros de arte
import grades from '../utils/grades'; // Importar los grados

const ArtePage = () => {
  const [userGrade, setUserGrade] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser')); // Obtener el usuario desde localStorage

    if (user) {
      setUserGrade(user.grade); // Establecer el grado del usuario
      setUserName(user.username || 'Usuario'); // Establecer el nombre del usuario
    } else {
      alert('No hay usuario autenticado.');
      // Puedes redirigir a una página de inicio de sesión si lo deseas
    }
  }, []);

  // Verifica si se está cargando la información del usuario
  if (userGrade === null) {
    return <p>Cargando...</p>;
  }

  // Obtener el orden de los grados desde grades.js
  const gradeLevels = grades.map(grade => grade.value); // Extraer los valores de los grados

  // Filtrar libros según el grado del usuario
  const accessibleBooks = arteBooks.filter(book => {
    return gradeLevels.indexOf(userGrade) >= gradeLevels.indexOf(book.grade);
  });

  return (
    <div className="genre-page">
      <h2>Libros de Arte</h2>
      <p>Bienvenido, {userName}!</p>
      <div className="books-grid">
        {accessibleBooks.length > 0 ? (
          accessibleBooks.map((book, index) => (
            <div key={index} className="book-card">
              <img src={book.cover} alt={book.title} />
              <h3>{book.title}</h3>
              <p>{book.author}</p>
            </div>
          ))
        ) : (
          <p>No tienes acceso a libros en esta categoría.</p>
        )}
      </div>
    </div>
  );
};

export default ArtePage;
