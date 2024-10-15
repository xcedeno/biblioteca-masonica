import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { supabase } from '../utils/supabaseClient'; // Importa tu instancia de Supabase
import grades from '../utils/grades'; // Importar los grados

const HomePage = () => {
  const navigate = useNavigate();
  const [userGrade, setUserGrade] = useState(null);
  const [userName, setUserName] = useState('');
  const [categories, setCategories] = useState([]); // Estado para las categorías

  useEffect(() => {
    // Obtener el usuario desde localStorage
    const user = JSON.parse(localStorage.getItem('currentUser')); 

    if (user) {
      setUserGrade(user.grade); // Establecer el grado del usuario
      setUserName(user.username || 'Usuario'); // Establecer el nombre del usuario
      fetchCategories(); // Llamar a la función para obtener categorías
    } else {
      alert('No hay usuario autenticado. Redirigiendo a inicio de sesión.');
      navigate('/login'); // Redirigir a la página de inicio de sesión si no hay usuario
    }
  }, [navigate]);

  // Función para obtener categorías desde Supabase
  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*'); // Seleccionar todas las categorías

      if (error) {
        console.error('Error al obtener categorías:', error.message);
      } else {
        // Construir URLs de imágenes
        const categoriesWithImages = data.map(category => ({
          ...category,
          // Construir la URL de la imagen usando el nombre de la categoría
          image_url: `https://heznwurkghqymlilvzoy.supabase.co/storage/v1/object/public/images/categories/${category.name.toLowerCase().replace(/\s+/g, '-')}.jpg`
        }));

        setCategories(categoriesWithImages); // Establecer las categorías con las imágenes en el estado
      }
    } catch (error) {
      console.error('Error en la consulta a Supabase:', error.message);
    }
  };

  if (userGrade === null) {
    return <p>Cargando...</p>;
  }

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
          <div key={category.id} className="category-card" onClick={() => handleCategoryClick(category.route)}>
            <img 
              src={category.image_url} // Usar la URL de la imagen construida
              alt={category.name} 
             // Ajustar el tamaño si es necesario
            />
            <h3>{category.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;
