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
    if (!notasEstudiante) return;

      const printWindow = window.open('', '_blank');
      
      // Generamos el contenido HTML del PDF
      printWindow.document.write(`
        <html>
          <head>
            <title>Reporte de Notas - ${notasEstudiante.nombre}</title>
            <style>
              body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 40px; color: #333; }
              .header { text-align: center; border-bottom: 2px solid #004a87; margin-bottom: 20px; padding-bottom: 10px; }
              .student-info { margin-bottom: 30px; line-height: 1.6; background: #f9f9f9; padding: 15px; border-radius: 8px; }
              table { width: 100%; border-collapse: collapse; margin-bottom: 25px; }
              th { background-color: #004a87; color: white; padding: 12px; text-align: left; }
              td { border: 1px solid #ddd; padding: 10px; }
              .nota-final { font-weight: bold; }
              .aprobado { color: #27ae60; }
              .reprobado { color: #e74c3c; }
              .eval-list { font-size: 0.9em; color: #666; list-style: none; padding: 0; margin: 0; }
              .footer { margin-top: 50px; text-align: center; font-size: 0.8em; color: #777; border-top: 1px solid #eee; padding-top: 10px; }
            </style>
          </head>
          <body>
            <div class="header">
              <h1>UNEXCA - Reporte Académico</h1>
            </div>
            
            <div class="student-info">
              <h2>Notas del Estudiante</h2>
              <p><strong>Nombre:</strong> ${notasEstudiante.nombre}</p>
              <p><strong>Cédula:</strong> V-${cedula}</p>
              <p><strong>Semestre:</strong> ${semestreSeleccionado}</p>
              <p><strong>Promedio del Semestre:</strong> ${promedioSemestre ? promedioSemestre.toFixed(2) : '--'} / 20</p>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Materia</th>
                  <th>Evaluaciones</th>
                  <th>Nota Final</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                ${notasEstudiante.materias.map(m => `
                  <tr>
                    <td><strong>${m.nombre}</strong></td>
                    <td>
                      <ul class="eval-list">
                        ${m.evaluaciones.map(e => `<li>${e.descripcion}: ${e.puntaje}/20 (${e.peso}%)</li>`).join('')}
                      </ul>
                    </td>
                    <td class="nota-final">${m.notaFinal.toFixed(2)} / 20</td>
                    <td class="${m.notaFinal >= 10 ? 'aprobado' : 'reprobado'}">
                      ${m.notaFinal >= 10 ? 'Aprobado' : 'Reprobado'}
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="footer">
              <p>Documento generado digitalmente por el Sistema de Gestión de Notas UNEXCA</p>
              <p>Fecha de emisión: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
            </div>
          </body>
        </html>
    `);

    printWindow.document.close();
    
    // Esperamos un momento para que el navegador procese el estilo antes de abrir el diálogo de impresión
    printWindow.onload = function() {
      printWindow.focus();
      printWindow.print();
      // Opcional: printWindow.close(); // Esto cerraría la pestaña automáticamente después de imprimir
   
    };
  };

  const handleSearchNotas = async (event) => {
    event.preventDefault();
    setNotasEstudiante(null);
    setMensaje('Buscando...');

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/notas_estudiante/${cedula}/${semestreSeleccionado}`);
      const data = await response.json();

      if (response.ok) {
        setNotasEstudiante(data);
        setMensaje(`Notas encontradas para el Semestre ${semestreSeleccionado}.`);
      } else {
        setMensaje(data.mensaje || 'Estudiante no encontrado o sin notas.');
      }

    } 
    catch (error) {
      console.error('Error de conexión:', error);
      setMensaje('Error de conexión con el servidor.');
    }

  }; // <--- Aquí termina la función. Asegúrate de que NO haya código suelto inmediatamente abajo.


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
                              <span className="eval-desc">{evaluacion.descripcion}: </span>
                              <span className="eval-nota">{evaluacion.puntaje}/20 </span>
                              <span className="eval-peso">({evaluacion.peso}%)</span>
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