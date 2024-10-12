import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import grades from '../utils/grades'; // Importar los grados

const HomePage = () => {
  const navigate = useNavigate();
  const [userGrade, setUserGrade] = useState(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('currentUser')); // Obtener el usuario desde localStorage

    if (user) {
      setUserGrade(user.grade); // Establecer el grado del usuario
      setUserName(user.username || 'Usuario'); // Establecer el nombre del usuario
    } else {
      alert('No hay usuario autenticado. Redirigiendo a inicio de sesión.');
      navigate('/login'); // Redirigir a la página de inicio de sesión si no hay usuario
    }
  }, [navigate]);

  if (userGrade === null) {
    return <p>Cargando...</p>;
  }

  const categories = [
    { name: 'Arte', route: '/arte' },
    { name: 'Ciencia', route: '/ciencia' },
    { name: 'Tecnología', route: '/tecnologia' },
    { name: 'Filosofía', route: '/filosofia' },
    { name: 'Historia Universal', route: '/historia-universal' },
    { name: 'Historia de Venezuela', route: '/historia-venezuela' },
  ];

  const handleCategoryClick = (route) => {
    navigate(route); // Navegar a la ruta de la categoría seleccionada
  };

  const userGradeLabel = grades.find(grade => grade.value === userGrade)?.label || 'Grado Desconocido';

  return (
    <div className="home-page">
      <div className="welcome-message">
        <h2>Bienvenido, {userName}!</h2>
        <p>Tu grado es: {userGradeLabel}</p>
      </div>
      <div className="categories">
        {categories.map((category) => (
          <div key={category.name} className="category-card" onClick={() => handleCategoryClick(category.route)}>
            <img 
              src={`/images/${category.name.toLowerCase().replace(' ', '-')}.jpg`} 
              alt={category.name} 
            />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
