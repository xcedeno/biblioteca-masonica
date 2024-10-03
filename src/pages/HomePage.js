// HomePage.js
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../firebase';
import { collection, query, where, getDocs } from "firebase/firestore"; // Importa las funciones necesarias
import BookCard from '../components/BookCard';

const HomePage = () => {
  const [books, setBooks] = useState([]);
  //const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) return; // Asegúrate de que hay un usuario autenticado

      const userDoc = await getDocs(query(collection(firestore, 'users'), where('uid', '==', currentUser.uid)));
      const userData = userDoc.docs[0]?.data();
      const userGrado = userData?.grado;

      if (userGrado) {
        const booksSnapshot = await getDocs(query(collection(firestore, 'books'), where('grado', '<=', userGrado)));
        const booksList = booksSnapshot.docs.map(doc => doc.data());
        setBooks(booksList);
      }
    };

    fetchBooks();
  }, []);

  return (
    <div>
      <h1>Biblioteca Masonica</h1>
      <div>
        {books.map((book, index) => (
          <BookCard key={index} book={book} />
        ))}
      </div>
    </div>
  );
};

export default HomePage;
