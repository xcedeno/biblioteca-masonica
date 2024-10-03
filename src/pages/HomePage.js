import React from 'react';
import { useLocation } from 'react-router-dom'; // Para recibir el grado del usuario desde el estado

const HomePage = () => {
  const location = useLocation();
  const { userGrade } = location.state || {}; // Obtener el grado del usuario

  const categories = [
    { name: 'Arte', minGrade: 'aprendiz' },
    { name: 'Ciencia', minGrade: 'compañero' },
    { name: 'Tecnología', minGrade: 'compañero' },
    { name: 'Filosofía', minGrade: 'aprendiz' },
    { name: 'Historia Universal', minGrade: 'maestro' },
    { name: 'Historia de Venezuela', minGrade: 'aprendiz' },
  ];

  const getGradeLevel = (grade) => {
    const levels = { 'aprendiz': 1, 'compañero': 2, 'maestro': 3 };
    return levels[grade] || 0;
  };

  const userGradeLevel = getGradeLevel(userGrade);

  return (
    <div className="home-page">
      <h2>Bienvenido a la Biblioteca</h2>
      <div className="categories">
        {categories.map((category) =>
          getGradeLevel(category.minGrade) <= userGradeLevel ? (
            <div key={category.name} className="category-card">
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
