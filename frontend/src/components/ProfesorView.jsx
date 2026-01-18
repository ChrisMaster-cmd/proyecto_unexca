// src/components/ProfesorView.jsx

import React, { useState, useMemo } from 'react';

function ProfesorView() {
  const [cedula, setCedula] = useState('');
  const [semestre, setSemestre] = useState('');
  const [materia, setMateria] = useState('');
  // Estado inicial con score (0-20), weight (0-100%) y description
  const [notas, setNotas] = useState([{ id: 1, score: '', weight: 100, description: 'Examen Final' }]);
  const [mensaje, setMensaje] = useState('');
  const [cargando, setCargando] = useState(false);

  // Simulación de datos (de un backend real)
  const materiasPorSemestre = {
    '1': ['Introducción a la Programación', 'Cálculo I'],
    '2': ['Programación II', 'Cálculo II'],
    '3': ['Estructuras de Datos', 'Física I'],
    '4': ['Bases de Datos', 'Física II'],
    '5': ['Redes de Computadoras', 'Sistemas Operativos'],
    '6': ['Inteligencia Artificial', 'Ingeniería de Software'],
    '7': ['Desarrollo Web Avanzado', 'Seguridad Informática'],
    '8': ['Proyecto de Grado', 'Emprendimiento Tecnológico'],
  };

  // --- Lógica de Cálculo de Notas Finales ---

  const { finalScore, totalWeight, isWeightValid } = useMemo(() => {
    let calculatedTotalWeight = 0;
    let weightedScoreSum = 0;

    notas.forEach(nota => {
      // Usamos parseFloat o 0 para evitar problemas con cadenas vacías
      const score = parseFloat(nota.score) || 0;
      const weight = parseFloat(nota.weight) || 0;

      calculatedTotalWeight += weight;
      
      // Fórmula de nota ponderada: (Puntaje / 20) * Peso
      // O, de forma más directa, Ponderación por el valor del puntaje (0-20)
      weightedScoreSum += (score * (weight / 100)); 
    });

    // La nota final es la suma ponderada (ya está calculada sobre 20)
    // El puntaje no puede superar 20
    const calculatedFinalScore = Math.min(weightedScoreSum, 20).toFixed(2);
    
    // Verificamos si la suma de los pesos es 100%
    const valid = calculatedTotalWeight === 100;

    return {
      finalScore: calculatedFinalScore,
      totalWeight: calculatedTotalWeight,
      isWeightValid: valid
    };
  }, [notas]);

  // --- Lógica de Manejo de Campos ---

  const handleAddNotaField = () => {
    // Cuando se añade un campo, asignamos un peso por defecto y reseteamos el resto
    const newId = notas.length ? Math.max(...notas.map(n => n.id)) + 1 : 1;
    setNotas([...notas, { id: newId, score: '', weight: '', description: `Evaluación ${newId}` }]);
  };

  const handleDeleteNotaField = (id) => {
    if (notas.length > 1) { 
      setNotas(notas.filter(nota => nota.id !== id));
    }
  };

  const handleFieldChange = (id, field, value) => {
    const newNotas = notas.map(nota => {
      if (nota.id === id) {
        // Asegurar que el peso y el score sean números y estén en el rango
        if (field === 'weight') {
          const numValue = Math.min(Math.max(0, parseFloat(value || 0)), 100);
          return { ...nota, [field]: value === '' ? '' : numValue };
        }
        if (field === 'score') {
          const numValue = Math.min(Math.max(0, parseFloat(value || 0)), 20);
          return { ...nota, [field]: value === '' ? '' : numValue };
        }
        return { ...nota, [field]: value };
      }
      return nota;
    }); // <--- Este cierra el map
    setNotas(newNotas);
  }; // <--- Este cierra la función

 const handleSubmit = async (event) => {
    event.preventDefault();
    
    if (!isWeightValid) {
      setMensaje('Error: La suma de los pesos porcentuales debe ser 100%.');
      return;
    }

    setCargando(true);

    const datosAEnviar = {
      cedula_estudiante: cedula,
      nombre_materia: materia,
      semestre: semestre,
      evaluaciones: notas 
    };

    try {
      const response = await fetch('http://127.0.0.1:5000/api/guardar_notas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosAEnviar)
      });

      if (response.ok) {
        setMensaje(`✅ Notas de ${cedula} guardadas. Nota Final: ${finalScore}`);
        setCedula('');
        setNotas([{ id: 1, score: '', weight: 100, description: 'Examen Final' }]);
      } else {
        const errorData = await response.json();
        setMensaje(`❌ Error: ${errorData.error || 'No se pudo guardar'}`);
      }
    } catch (error) {
      console.error('Error:', error);
      setMensaje('❌ No se pudo conectar con el servidor (¿Está prendido Flask?)');
    } finally {
      setCargando(false);
      setTimeout(() => setMensaje(''), 5000);
    }
  };
  return (
    <section className="card-section form-card">
      <h2 className="form-title">Carga de Notas (Ponderación Dinámica)</h2>
      {mensaje && <p className={isWeightValid ? "success-message" : "error-message"}>{mensaje}</p>}

      <form className="grades-form" onSubmit={handleSubmit}>
        {/* CAMPOS SUPERIORES (Cédula, Semestre, Materia) */}
        <div className="form-group">
          <label htmlFor="cedula">Cédula de Estudiante</label>
          <input
            type="text"
            id="cedula"
            placeholder="Cédula (8 dígitos)"
            value={cedula}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, '');
              setCedula(soloNumeros.slice(0, 8));
            }}
            maxLength="8"
            inputMode="numeric"
            pattern="\d*"
            required
          />
        </div>
        
        {/* SELECTS DE SEMESTRE Y MATERIA (omitiendo código por brevedad, asumiendo que funciona) */}
        <div className="form-group">
          <label htmlFor="semestre">Semestre</label>
          <select
            id="semestre"
            value={semestre}
            onChange={(e) => {
              setSemestre(e.target.value);
              setMateria(''); 
            }}
            required
          >
            <option value="">Seleccione un Semestre</option>
            {[...Array(8).keys()].map(i => (
              <option key={i + 1} value={String(i + 1)}>Semestre {i + 1}</option>
            ))}
          </select>
        </div>

        {semestre && (
          <div className="form-group">
            <label htmlFor="materia">Materia</label>
            <select
              id="materia"
              value={materia}
              onChange={(e) => setMateria(e.target.value)}
              required
            >
              <option value="">Seleccione una Materia</option>
              {materiasPorSemestre[semestre]?.map((mat, index) => (
                <option key={index} value={mat}>{mat}</option>
              ))}
            </select>
          </div>
        )}

        {/* ------------------ SECCIÓN DE NOTAS DINÁMICAS Y PESOS ------------------ */}
        <div className="grades-container">
          <label className="input-label-header">PONDERACIÓN Y NOTAS (0-20)</label>
          
          {/* Encabezados de la tabla de notas */}
          <div className="grades-header">
            <span className="col-desc">Descripción</span>
            <span className="col-weight">Peso (%)</span>
            <span className="col-score">Puntaje (0-20)</span>
            <span className="col-actions">Acciones</span>
          </div>

          {/* Mapeo de campos de notas */}
          {notas.map((notaField) => (
            <div key={notaField.id} className="nota-input-group dynamic-fields">
              
              {/* Campo de Descripción */}
              <input
                type="text"
                placeholder="Descripción (e.g. Tarea 1)"
                value={notaField.description}
                className="col-desc"
                onChange={(e) => handleFieldChange(notaField.id, 'description', e.target.value)}
                required
              />

              {/* Campo de Peso (0-100%) */}
              <input
                type="number"
                min="0"
                max="100"
                placeholder="%"
                value={notaField.weight}
                className="col-weight"
                onChange={(e) => handleFieldChange(notaField.id, 'weight', e.target.value)}
                required
              />

              {/* Campo de Puntaje (0-20) */}
              <input
                type="number"
                min="0"
                max="20"
                placeholder="Nota (0-20)"
                value={notaField.score}
                className="col-score"
                onChange={(e) => handleFieldChange(notaField.id, 'score', e.target.value)}
                required
              />
              
              {/* Botón de Borrar */}
              {notas.length > 1 && (
                <button
                  type="button"
                  onClick={() => handleDeleteNotaField(notaField.id)}  
                  className="delete-nota-btn col-actions"
                  title="Eliminar Evaluación"
                >
                  &times;
                </button>
              )}
              {notas.length === 1 && <span className="col-actions"></span>} {/* Placeholder */}
            </div>
          ))}

          <button type="button" onClick={handleAddNotaField} className="add-nota-btn">
            + Añadir Campo de Evaluación
          </button>
        </div>
        {/* ------------------ FIN SECCIÓN DE NOTAS DINÁMICAS ------------------ */}

        {/* Display de la Nota Final Calculada */}
        <div className={`final-grade-display ${isWeightValid ? 'valid' : 'invalid'}`}>
          <p>
            Total de Peso Asignado: 
            <span className="total-weight-value">{totalWeight}%</span>
            {totalWeight !== 100 && <span className="warning-text"> (Debe ser 100%)</span>}
          </p>
          <p className="final-score-text">
            Nota Final Ponderada (0-20): 
            <span className="final-score-value">{isWeightValid ? finalScore : '--'}</span>
          </p>
        </div>
        
        <button type="submit" className="save-button" disabled={!isWeightValid || cargando}>
          Guardar Notas
          {cargando ? 'Procesando...' : 'Guardar Notas'}
        </button>
      </form>
    </section>
  );

}

export default ProfesorView;
