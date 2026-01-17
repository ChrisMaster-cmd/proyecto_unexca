from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
# Importamos la libreria ReportLab para el pdf
from academic import Nota, Materia 

def generar_pdf_estudiante(cedula_alumno):
    # Consulta la base de datos usando SQLAlchemy
    # Unimos Nota con Materia para obtener el nombre de la asignatura
    notas_estudiante = Nota.query.join(Materia).filter(Nota.estudiante_cedula == cedula_alumno).all()

    if not notas_estudiante:
        print(f"No hay registros para la cédula: {cedula_alumno}")
        return

    # Elementos de el archivo PDF
    doc = SimpleDocTemplate(f"Reporte_{cedula_alumno}.pdf", pagesize=A4)
    elementos = []
    estilos = getSampleStyleSheet()

    # Título
    elementos.append(Paragraph(f"BOLETA DE CALIFICACIONES", estilos['Title']))
    elementos.append(Paragraph(f"Cédula del Estudiante: {cedula_alumno}", estilos['Normal']))
    elementos.append(Spacer(1, 20))

    # Estructura de los datos para la tabla del PDF
    # Encabezados basados en las clases: Materia, Descripción, Peso/Porcentaje, Puntaje
    data_tabla = [["Materia", "Descripción", "Peso %", "Puntaje"]]
    
    total_puntos = 0
    for n in notas_estudiante:
        # Accedemos a n.materia ya que SQLAlchemy crea la relación
        nombre_materia = n.materia.nombre if hasattr(n, 'materia') else f"ID: {n.materia_id}"
        
        fila = [
            nombre_materia,
            n.descripcion,
            f"{n.peso_porcentaje}%",
            str(n.puntaje)
        ]
        data_tabla.append(fila)
        total_puntos += n.puntaje

    #Diseño de la tabla
    tabla = Table(data_tabla, colWidths=[120, 180, 70, 70])
    tabla.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.darkblue),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.whitesmoke),
        ('GRID', (0, 0), (-1, -1), 1, colors.black),
        ('ALIGN', (2, 1), (-1, -1), 'CENTER'), # Centrar números
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
    ]))
    
    elementos.append(tabla)
    
    # Generar el documento
    doc.build(elementos)
    print("Reporte generado con éxito.")