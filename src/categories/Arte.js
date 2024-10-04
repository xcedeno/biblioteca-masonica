import React from 'react';

const ArtePage = () => {
  const books = [
    { title: 'Historia del Arte', author: 'John Smith', cover: '/images/historia-del-arte.jpg' },
    { title: 'Escultura Moderna', author: 'Jane Doe', cover: '/images/escultura-moderna.jpg' },
    // Agrega más libros aquí
  ];

  return (
    <div className="genre-page">
      <h2>Libros de Arte</h2>
      <div className="books-grid">
        {books.map((book, index) => (
          <div key={index} className="book-card">
            <img src={book.cover} alt={book.title} />
            <h3>{book.title}</h3>
            <p>{book.author}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArtePage;
