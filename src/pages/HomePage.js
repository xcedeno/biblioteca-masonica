import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom'; // Para la navegación
import './HomePage.css';

const HomePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userGrade } = location.state || {}; // Obtener el grado del usuario

  const categories = [
    { name: 'Arte', minGrade: 'aprendiz', route: '/arte' }, // Ruta para la página de Arte
    { name: 'Ciencia', minGrade: 'compañero', route: '/ciencia' },
    { name: 'Tecnología', minGrade: 'compañero', route: '/tecnologia' },
    { name: 'Filosofía', minGrade: 'aprendiz', route: '/filosofia' },
    { name: 'Historia Universal', minGrade: 'maestro', route: '/historia-universal' },
    { name: 'Historia de Venezuela', minGrade: 'aprendiz', route: '/historia-venezuela' },
  ];

  const getGradeLevel = (grade) => {
    const levels = { 'aprendiz': 1, 'compañero': 2, 'maestro': 3 };
    return levels[grade] || 0;
  };

  const userGradeLevel = getGradeLevel(userGrade);

  const handleCategoryClick = (route) => {
    navigate(route); // Navegar a la ruta de la categoría seleccionada
  };

  return (
    <div className="home-page">
      <h2>Bienvenido a la Biblioteca</h2>
      <div className="categories">
        {categories.map((category) =>
          getGradeLevel(category.minGrade) <= userGradeLevel ? (
            <div key={category.name} className="category-card" onClick={() => handleCategoryClick(category.route)}>
              <img src={`/images/${category.name.toLowerCase().replace(' ', '-')}.jpg`} alt={category.name} />
              <h3>{category.name}</h3>
            </div>
          ) : null
        )}
      </div>
    </div>
  );
};

export default HomePage;
