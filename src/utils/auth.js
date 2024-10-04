// src/utils/auth.js
import { db } from './firebase'; // Asegúrate de importar tu configuración de Firebase
import { collection, getDocs } from 'firebase/firestore';

export const authenticateUser = async (username, password) => {
    const usersCollection = collection(db, 'users'); // Asegúrate de que esta colección se llame correctamente
    const usersSnapshot = await getDocs(usersCollection);
    let authenticatedUser = null;

    usersSnapshot.forEach((doc) => {
        const userData = doc.data();
        // Asegúrate de que 'username' y 'password' son los nombres correctos de tus campos
        if (userData.username === username && userData.password === password) {
            authenticatedUser = { ...userData, id: doc.id }; // Agrega el ID del documento si es necesario
        }
    });

    return authenticatedUser; // Retorna el usuario autenticado o null si no se encuentra
};
