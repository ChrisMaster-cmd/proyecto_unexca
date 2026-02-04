import React, { useState, useMemo } from 'react';

function StudentView() {
  const [cedula, setCedula] = useState('');
  const [semestreSeleccionado, setSemestreSeleccionado] = useState('');
  const [notasEstudiante, setNotasEstudiante] = useState(null);
  const [mensaje, setMensaje] = useState('');

  // --- LÓGICA DE IMPRESIÓN ---
  const handleImprimir = () => {
    if (!notasEstudiante) return;
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
        <html>
          <head>
            <title>Reporte - ${notasEstudiante.nombre}</title>
            <style>
               body { font-family: sans-serif; padding: 20px; color: #333; }
               .header { text-align: center; border-bottom: 2px solid #003366; margin-bottom: 20px; }
               table { width: 100%; border-collapse: collapse; margin-top: 20px; }
               th { background: #003366; color: white; padding: 10px; text-align: left; }
               td { border: 1px solid #ddd; padding: 8px; }
               .aprobado { color: green; font-weight: bold; } 
               .reprobado { color: red; font-weight: bold; }
            </style>
          </head>
          <body>
            <div class="header"><h1>UNEXCA - Reporte de Notas</h1></div>
            <p><strong>Estudiante:</strong> ${notasEstudiante.nombre}</p>
            <p><strong>Cédula:</strong> V-${cedula}</p>
            <table>
              <thead><tr><th>Materia</th><th>Evaluaciones</th><th>Nota</th><th>Estado</th></tr></thead>
              <tbody>
                ${notasEstudiante.materias.map(m => {
                  // APLICAMOS EL SEGURO AQUÍ PARA EL PDF
                  const notaSegura = Math.min(m.notaFinal, 20).toFixed(2);
                  return `
                  <tr>
                    <td>${m.nombre}</td>
                    <td>
                        <ul style="margin:0; padding-left:15px; font-size:0.9em;">
                        ${m.evaluaciones.map(e => `<li>${e.descripcion}: ${e.puntaje}/20 (${e.peso}%)</li>`).join('')}
                        </ul>
                    </td>
                    <td>${notaSegura}</td>
                    <td class="${notaSegura >= 10 ? 'aprobado' : 'reprobado'}">
                        ${notaSegura >= 10 ? 'Aprobado' : 'Reprobado'}
                    </td>
                  </tr>`;
                }).join('')}
              </tbody>
            </table>
          </body>
        </html>
    `);
    printWindow.document.close();
    printWindow.onload = function() { printWindow.focus(); printWindow.print(); };
  };

  // --- LÓGICA DE BÚSQUEDA ---
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
        setNotasEstudiante(null);
        setMensaje(data.mensaje || 'Estudiante no encontrado o sin notas.');
      }
    } 
    catch (error) {
      console.error('Error de conexión:', error);
      setMensaje('Error de conexión con el servidor.');
    }
  };

  const promedioSemestre = useMemo(() => {
    if (!notasEstudiante || !notasEstudiante.materias) return null;
    const materiasConNota = notasEstudiante.materias.filter(m => m.notaFinal !== null);
    if (materiasConNota.length === 0) return null;
    
    // APLICAMOS EL SEGURO AL PROMEDIO TAMBIÉN
    const suma = materiasConNota.reduce((total, materia) => total + Math.min(materia.notaFinal, 20), 0);
    return suma / materiasConNota.length;
  }, [notasEstudiante]);

  return (
    <section className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden my-8">
      <div className="bg-[#003366] p-6 text-center">
        <h2 className="text-2xl font-bold text-white uppercase tracking-wider">
          Consulta de Notas del Estudiante
        </h2>
      </div>
      
      <div className="p-6 md:p-8">
        {mensaje && (
          <div className={`p-4 rounded-md mb-6 text-center font-medium border ${
            mensaje.includes('Error') || mensaje.includes('no encontrado') 
              ? "bg-red-50 text-red-700 border-red-200" 
              : "bg-blue-50 text-blue-700 border-blue-200"
          }`}>
            {mensaje}
          </div>
        )}

        <form onSubmit={handleSearchNotas} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2 uppercase">Cédula de Estudiante *</label>
              <input
                type="text"
                placeholder="Ej: 12345678"
                value={cedula}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003366] outline-none transition-all"
                onChange={(e) => setCedula(e.target.value.replace(/\D/g, '').slice(0, 8))}
                maxLength="8"
                required
              />
            </div>

            <div className="flex flex-col">
              <label className="text-sm font-bold text-gray-700 mb-2 uppercase">Semestre *</label>
              <select
                value={semestreSeleccionado}
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#003366] outline-none bg-white"
                onChange={(e) => setSemestreSeleccionado(e.target.value)}
                required
              >
                <option value="">Seleccione...</option>
                {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                  <option key={num} value={String(num)}>Semestre {num}</option>
                ))}
              </select>
            </div>
          </div>

          <button type="submit" className="w-full bg-[#003366] hover:bg-blue-900 text-white font-bold py-3 rounded-md shadow-md transition-all uppercase tracking-wide">
            Consultar Notas
          </button>
        </form>

        {notasEstudiante && (
          <div className="mt-10 pt-6 border-t border-gray-100">
            <div className="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-200">
                <p className="text-lg"><strong>Estudiante:</strong> {notasEstudiante.nombre}</p>
                <p className="text-gray-600">C.I: V-{cedula}</p>
                {promedioSemestre !== null && (
                   <p className="mt-2 text-lg">
                     Promedio: 
                     <span className={`ml-2 font-bold ${promedioSemestre >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                        {/* SEGURO EN EL PROMEDIO VISUAL */}
                        {Math.min(promedioSemestre, 20).toFixed(2)} / 20
                     </span>
                   </p>
                )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-[#003366] text-white text-sm uppercase">
                    <th className="p-3 text-left rounded-tl-lg">Materia</th>
                    <th className="p-3 text-left">Evaluaciones</th>
                    <th className="p-3 text-center">Nota Final</th>
                    <th className="p-3 text-center rounded-tr-lg">Estado</th>
                  </tr>
                </thead>
                <tbody className="text-gray-700">
                  {notasEstudiante.materias.map((materia, idx) => {
                    // SEGURO EN LA NOTA DE CADA FILA
                    const notaMostrar = Math.min(materia.notaFinal, 20);
                    return (
                      <tr key={idx} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="p-3 font-medium align-top">{materia.nombre}</td>
                        <td className="p-3 align-top">
                           <ul className="text-sm space-y-1">
                             {materia.evaluaciones.map((eva, i) => (
                               <li key={i} className="text-gray-600">
                                 • <span className="font-medium">{eva.description || eva.descripcion}:</span> {eva.puntaje} <span className="text-xs text-gray-400">({eva.peso}%)</span>
                               </li>
                             ))}
                           </ul>
                        </td>
                        <td className={`p-3 text-center font-bold align-top ${notaMostrar >= 10 ? 'text-green-600' : 'text-red-600'}`}>
                          {notaMostrar.toFixed(2)}
                        </td>
                        <td className="p-3 text-center align-top">
                          <span className={`px-2 py-1 rounded text-xs font-bold ${
                              notaMostrar >= 10 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                          }`}>
                              {notaMostrar >= 10 ? 'APROBADO' : 'REPROBADO'}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <button onClick={handleImprimir} className="mt-6 w-full sm:w-auto px-6 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 transition shadow">
              🖨️ Imprimir Reporte PDF
            </button>
          </div>
        )}
      </div>
    </section>
  );
}

export default StudentView;