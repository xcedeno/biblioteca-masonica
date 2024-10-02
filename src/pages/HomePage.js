import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const currentUser = auth.currentUser;
      const userDoc = await firestore.collection('users').doc(currentUser.uid).get();
      const userGrado = userDoc.data().grado;

      const booksSnapshot = await firestore.collection('books')
        .where('grado', '<=', userGrado)
        .get();

      const booksList = booksSnapshot.docs.map(doc => doc.data());
      setBooks(booksList);
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Biblioteca Masonica</h1>
      <div>
        {books.map(book => (
          <BookCard key={book.title} book={book} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
