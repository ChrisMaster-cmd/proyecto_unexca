import React, { useState } from 'react';
import './index.css'; // Asegúrate de que los estilos están importados
import ProfesorView from './components/ProfesorView';
import StudentView from './components/StudentView';

function App() {
  const [userType, setUserType] = useState('profesor'); // 'profesor' o 'estudiante'

  return (
    <div className="unexca-app">
      
      {/* Encabezado Principal */}
      <header className="header">
        <h1>UNEXCA - Carga y Consulta de Notas</h1>
        <nav className="user-switcher">
          <button 
            className={`switch-btn ${userType === 'profesor' ? 'active' : ''}`} 
            onClick={() => setUserType('profesor')}
          >
            Vista Profesor
          </button>
         {/* Boton integrado para la vista del estudiante */}
         <button
         className={`switch-btn ${userType === 'estudiante' ? 'active' : ''}`}
         onClick={() => setUserType('estudiante')}
         >
          Vista estudiante
         </button>
        </nav>
      </header>

      <main className="container">
        {userType === 'profesor' ? <ProfesorView /> : <StudentView />}
      </main>
      
    </div>
  );
}

export default App;
