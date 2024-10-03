let users = JSON.parse(localStorage.getItem('users')) || []; // Cargar los usuarios desde localStorage

export const authenticateUser = (username, password) => {
    return users.find(user => user.username === username && user.password === password);
};

export const addUser = (newUser) => {
    const existingUser = users.find(user => user.username === newUser.username);
    
    if (existingUser) {
        alert('El usuario ya existe');
        return; // Si el usuario ya existe, no lo agrega
    }

    users.push(newUser); // Agrega el nuevo usuario al arreglo de usuarios
    localStorage.setItem('users', JSON.stringify(users)); // Guarda la lista actualizada en localStorage
};

export const getUsers = () => {
    return users; // Retorna la lista de usuarios
};
