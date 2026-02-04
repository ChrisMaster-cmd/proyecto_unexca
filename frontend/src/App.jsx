import React, { useState } from 'react';
import './index.css';
import ProfesorView from './components/ProfesorView';
import StudentView from './components/StudentView';

function App() {
  const [userType, setUserType] = useState('profesor');

  return (
    // bg-unexca-bg es el gris clarito que definimos en el index.css
    <div className="min-h-screen bg-[#eef1f5]">
      
      {/* Encabezado Principal con Tailwind */}
      <header className="bg-[#003366] text-white shadow-lg p-6 mb-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-xl md:text-2xl font-bold tracking-tight">
            UNEXCA - Gestión de Notas
          </h1>
          
          <nav className="flex bg-blue-900/50 p-1 rounded-lg">
            <button 
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                userType === 'profesor' 
                ? 'bg-white text-[#003366] shadow-md' 
                : 'text-blue-100 hover:text-white'
              }`} 
              onClick={() => setUserType('profesor')}
            >
              Vista Profesor
            </button>
            <button
              className={`px-6 py-2 rounded-md font-semibold transition-all ${
                userType === 'estudiante' 
                ? 'bg-white text-[#003366] shadow-md' 
                : 'text-blue-100 hover:text-white'
              }`}
              onClick={() => setUserType('estudiante')}
            >
              Vista Estudiante
            </button>
          </nav>
        </div>
      </header>

      {/* Main con Tailwind */}
      <main className="container mx-auto px-4 pb-12">
        {userType === 'profesor' ? <ProfesorView /> : <StudentView />}
      </main>
      
    </div>
  );
}

export default App;