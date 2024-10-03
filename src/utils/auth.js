const users = [
    {
        username: "master",
        password: "master",
        grado: "0" // Grado para el usuario master
    },
    {
        username: "user1",
        password: "password1",
        grado: "1" // Otro usuario con un grado diferente
    },
    // Puedes agregar más usuarios aquí si es necesario
];

export const authenticateUser = (username, password) => {
    const user = users.find(
        (user) => user.username === username && user.password === password
    );

    if (user) {
        return user; // Devuelve el usuario si la autenticación es exitosa
    } else {
        throw new Error("Usuario o contraseña incorrectos");
    }
};
