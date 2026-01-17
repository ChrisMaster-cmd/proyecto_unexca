// src/components/StudentView.jsx

import React, { useState, useMemo } from 'react';

function StudentView() {
  const [cedula, setCedula] = useState('');
  const [semestreSeleccionado, setSemestreSeleccionado] = useState('');
  const [notasEstudiante, setNotasEstudiante] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // Datos simulados mejorados (estructura más realista)
  const mockNotasDB = {
    '12345678': {
      nombre: 'Juan Pérez',
      semestres: {
        '1': {
          materias: [
            {
              nombre: 'Introducción a la Programación',
              evaluaciones: [
                { descripcion: 'Tarea 1', puntaje: 15, peso: 20 },
                { descripcion: 'Quiz 1', puntaje: 18, peso: 10 },
                { descripcion: 'Examen Final', puntaje: 16.5, peso: 70 }
              ],
              notaFinal: 16.3
            },
            {
              nombre: 'Cálculo I',
              evaluaciones: [
                { descripcion: 'Tarea 1', puntaje: 12, peso: 15 },
                { descripcion: 'Examen Parcial', puntaje: 10, peso: 35 },
                { descripcion: 'Examen Final', puntaje: 11, peso: 50 }
              ],
              notaFinal: 10.8
            }
          ]
        },
        '2': {
          materias: [
            {
              nombre: 'Programación II',
              evaluaciones: [
                { descripcion: 'Proyecto 1', puntaje: 19, peso: 30 },
                { descripcion: 'Proyecto 2', puntaje: 20, peso: 30 },
                { descripcion: 'Examen Final', puntaje: 19.5, peso: 40 }
              ],
              notaFinal: 19.5
            }
          ]
        }
      }
    },
    '87654321': {
      nombre: 'María Rodríguez',
      semestres: {
        '1': {
          materias: [
            {
              nombre: 'Introducción a la Programación',
              evaluaciones: [
                { descripcion: 'Tarea 1', puntaje: 10, peso: 20 },
                { descripcion: 'Quiz 1', puntaje: 12, peso: 10 },
                { descripcion: 'Examen Final', puntaje: 11, peso: 70 }
              ],
              notaFinal: 10.9
            }
          ]
        }
      }
    }
  };

  // Lista de materias por semestre (coincide con ProfesorView)
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

  // Función para imprimir el reporte
  const handleImprimir = () => {
    const printWindow = window.open('', '_blank');
    const estudiante = mockNotasDB[cedula];
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Reporte de Notas - ${estudiante.nombre}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #2c3e50; border-bottom: 2px solid #3498db; padding-bottom: 10px; }
            h2 { color: #34495e; margin-top: 30px; }
            .header-info { margin-bottom: 30px; padding: 20px; background: #f8f9fa; border-radius: 5px; }
            .info-item { margin: 5px 0; }
            .materia-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .materia-table th { background-color: #3498db; color: white; padding: 12px; text-align: left; }
            .materia-table td { padding: 10px; border: 1px solid #ddd; }
            .materia-table tr:nth-child(even) { background-color: #f2f2f2; }
            .nota-final { font-weight: bold; color: #2c3e50; }
            .evaluacion-detalle { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; }
            .evaluacion-table { width: 100%; margin-top: 10px; }
            .evaluacion-table th { background-color: #95a5a6; color: white; padding: 8px; }
            .footer { margin-top: 40px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #7f8c8d; }
            .aprobado { color: #27ae60; font-weight: bold; }
            .reprobado { color: #e74c3c; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Reporte Oficial de Notas</h1>
          <div class="header-info">
            <div class="info-item"><strong>Estudiante:</strong> ${estudiante.nombre}</div>
            <div class="info-item"><strong>Cédula:</strong> V-${cedula}</div>
            <div class="info-item"><strong>Semestre:</strong> ${semestreSeleccionado}</div>
            <div class="info-item"><strong>Fecha de emisión:</strong> ${new Date().toLocaleDateString()}</div>
          </div>
    `);

    const semestreData = estudiante.semestres[semestreSeleccionado];
    
    semestreData.materias.forEach((materia, index) => {
      const estado = materia.notaFinal >= 10 ? 'Aprobado' : 'Reprobado';
      const claseEstado = materia.notaFinal >= 10 ? 'aprobado' : 'reprobado';
      
      printWindow.document.write(`
        <h2>${index + 1}. ${materia.nombre}</h2>
        <table class="materia-table">
          <thead>
            <tr>
              <th>Evaluación</th>
              <th>Puntaje</th>
              <th>Peso</th>
              <th>Contribución</th>
            </tr>
          </thead>
          <tbody>
      `);
      
      materia.evaluaciones.forEach(evaluacion => {
        const contribucion = (evaluacion.puntaje * evaluacion.peso) / 100;
        printWindow.document.write(`
          <tr>
            <td>${evaluacion.descripcion}</td>
            <td>${evaluacion.puntaje}/20</td>
            <td>${evaluacion.peso}%</td>
            <td>${contribucion.toFixed(2)}</td>
          </tr>
        `);
      });
      
      printWindow.document.write(`
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3" style="text-align: right;"><strong>Nota Final:</strong></td>
              <td class="nota-final ${claseEstado}">${materia.notaFinal.toFixed(2)}/20 - ${estado}</td>
            </tr>
          </tfoot>
        </table>
      `);
    });

    // Calcular promedio del semestre
    const promedioSemestre = semestreData.materias.reduce((sum, materia) => sum + materia.notaFinal, 0) / semestreData.materias.length;
    const estadoSemestre = promedioSemestre >= 10 ? 'Aprobado' : 'Reprobado';
    
    printWindow.document.write(`
          <div style="margin-top: 30px; padding: 20px; background: #ecf0f1; border-radius: 5px;">
            <h3>Resumen del Semestre</h3>
            <p><strong>Promedio del Semestre:</strong> ${promedioSemestre.toFixed(2)}/20 - ${estadoSemestre}</p>
            <p><strong>Materias Cursadas:</strong> ${semestreData.materias.length}</p>
          </div>
          <div class="footer">
            <p>Universidad Tecnológica - Sistema de Gestión Académica</p>
            <p>Este documento es generado automáticamente y no requiere firma física.</p>
          </div>
        </body>
      </html>
    `);
    
    printWindow.document.close();
    printWindow.focus();
    
    // Esperar a que cargue el contenido antes de imprimir
    setTimeout(() => {
      printWindow.print();
      // Opcional: cerrar la ventana después de imprimir
      // printWindow.close();
    }, 500);
  };

  const handleSearchNotas = (event) => {
    event.preventDefault();
    setNotasEstudiante(null);
    setMensaje('');

    if (!cedula) {
      setMensaje('Error: Por favor, ingrese su cédula.');
      return;
    }

    if (!semestreSeleccionado) {
      setMensaje('Error: Por favor, seleccione un semestre.');
      return;
    }

    // Validar cédula (8 dígitos)
    if (!/^\d{8}$/.test(cedula)) {
      setMensaje('Error: La cédula debe tener 8 dígitos numéricos.');
      return;
    }

    const estudianteData = mockNotasDB[cedula];
    
    if (!estudianteData) {
      setMensaje('Estudiante no encontrado en el sistema.');
      return;
    }

    const semestreData = estudianteData.semestres[semestreSeleccionado];
    
    if (!semestreData) {
      // Mostrar todas las materias del semestre (incluso si no tiene notas)
      const materiasSemestre = materiasPorSemestre[semestreSeleccionado] || [];
      const materiasConNotas = materiasSemestre.map(nombreMateria => ({
        nombre: nombreMateria,
        evaluaciones: [],
        notaFinal: null,
        sinNotas: true
      }));
      
      setNotasEstudiante({
        nombre: estudianteData.nombre,
        materias: materiasConNotas
      });
      setMensaje(`No se encontraron notas registradas para el Semestre ${semestreSeleccionado}. Mostrando materias del semestre.`);
    } else {
      setNotasEstudiante({
        nombre: estudianteData.nombre,
        materias: semestreData.materias
      });
      setMensaje(`Notas encontradas para el Semestre ${semestreSeleccionado}.`);
    }
  };

  // Calcular promedio del semestre
  const promedioSemestre = useMemo(() => {
    if (!notasEstudiante || !notasEstudiante.materias) return null;
    
    const materiasConNota = notasEstudiante.materias.filter(m => m.notaFinal !== null);
    if (materiasConNota.length === 0) return null;
    
    const suma = materiasConNota.reduce((total, materia) => total + materia.notaFinal, 0);
    return suma / materiasConNota.length;
  }, [notasEstudiante]);

  return (
    <section className="card-section form-card">
      <h2 className="form-title">Consulta de Notas del Estudiante</h2>
      
      {mensaje && (
        <p className={mensaje.includes('Error') ? "error-message" : "success-message"}>
          {mensaje}
        </p>
      )}

      <form className="grades-form" onSubmit={handleSearchNotas}>
        <div className="form-group">
          <label htmlFor="cedulaEstudiante">Cédula de Estudiante *</label>
          <input
            type="text"
            id="cedulaEstudiante"
            placeholder="Cédula (8 dígitos)"
            value={cedula}
            onChange={(e) => {
              const soloNumeros = e.target.value.replace(/\D/g, '');
              setCedula(soloNumeros.slice(0, 8));
            }}
            maxLength="8"
            inputMode="numeric"
            pattern="\d{8}"
            required
          />
          <small className="form-hint">8 dígitos numéricos</small>
        </div>

        <div className="form-group">
          <label htmlFor="semestreConsulta">Semestre *</label>
          <select
            id="semestreConsulta"
            value={semestreSeleccionado}
            onChange={(e) => setSemestreSeleccionado(e.target.value)}
            required
          >
            <option value="">Seleccione un Semestre</option>
            {[...Array(8).keys()].map(i => (
              <option key={i + 1} value={String(i + 1)}>Semestre {i + 1}</option>
            ))}
          </select>
        </div>

        <button type="submit" className="primary-button">
          Consultar Notas
        </button>
      </form>

      {notasEstudiante && (
        <div className="student-grades-results">
          <div className="student-header">
            <h3>Notas del Estudiante</h3>
            <div className="student-info">
              <p><strong>Nombre:</strong> {notasEstudiante.nombre}</p>
              <p><strong>Cédula:</strong> V-{cedula}</p>
              <p><strong>Semestre:</strong> {semestreSeleccionado}</p>
              {promedioSemestre !== null && (
                <p className="promedio-semestre">
                  <strong>Promedio del Semestre:</strong> 
                  <span className={`nota-final ${promedioSemestre >= 10 ? 'aprobado' : 'reprobado'}`}>
                    {promedioSemestre.toFixed(2)} / 20
                  </span>
                </p>
              )}
            </div>
          </div>

          <div className="table-container">
            <table className="materia-table">
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Evaluaciones</th>
                  <th>Nota Final</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {notasEstudiante.materias.map((materia, index) => (
                  <tr key={index}>
                    <td>{materia.nombre}</td>
                    <td>
                      {materia.sinNotas ? (
                        <span className="sin-notas">Sin notas registradas</span>
                      ) : (
                        <div className="evaluaciones-detalle">
                          {materia.evaluaciones.map((evaluacion, idx) => (
                            <div key={idx} className="evaluacion-item">
                              <span className="eval-desc">{eval.descripcion}: </span>
                              <span className="eval-nota">{eval.puntaje}/20</span>
                              <span className="eval-peso">({eval.peso}%)</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </td>
                    <td>
                      {materia.notaFinal !== null ? (
                        <span className={`nota-final ${materia.notaFinal >= 10 ? 'aprobado' : 'reprobado'}`}>
                          {materia.notaFinal.toFixed(2)} / 20
                        </span>
                      ) : (
                        <span className="sin-notas">--</span>
                      )}
                    </td>
                    <td>
                      {materia.notaFinal !== null ? (
                        <span className={`estado-badge ${materia.notaFinal >= 10 ? 'badge-aprobado' : 'badge-reprobado'}`}>
                          {materia.notaFinal >= 10 ? 'Aprobado' : 'Reprobado'}
                        </span>
                      ) : (
                        <span className="sin-notas">Pendiente</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="action-buttons">
            <button
              type="button"
              onClick={handleImprimir}
              className="print-button"
              disabled={notasEstudiante.materias.every(m => m.sinNotas)}
            >
              Imprimir Reporte
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="secondary-button"
            >
              Imprimir Esta Página
            </button>
          </div>
        </div>
      )}
    </section>
  );
}

export default StudentView;