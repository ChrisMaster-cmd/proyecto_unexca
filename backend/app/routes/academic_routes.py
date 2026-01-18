from flask import Blueprint, request, jsonify
from app.models.academic import Materia, Nota
from app.extensions import db

academic_bp = Blueprint('academic', __name__)

# --- RUTA EXISTENTE (Para llenar los selectores en React) ---
@academic_bp.route('/api/materias', methods=['GET'])
def obtener_materias():
    try:
        materias = Materia.query.all()
        return jsonify([{"id": m.id, "nombre": m.nombre} for m in materias]), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# --- NUEVA RUTA (Para guardar lo que el profesor escribe) ---
@academic_bp.route('/api/guardar_notas', methods=['POST'])
def guardar_notas():
    data = request.get_json()
    try:
        # Buscamos o creamos la materia basándonos en lo que viene de React
        materia = Materia.query.filter_by(nombre=data.get('nombre_materia'), semestre=data.get('semestre')).first()
        
        if not materia:
            materia = Materia(nombre=data.get('nombre_materia'), semestre=data.get('semestre'))
            db.session.add(materia)
            db.session.flush()

        # Guardamos el array de evaluaciones
        for eval in data.get('evaluaciones', []):
            nueva_nota = Nota(
                estudiante_cedula=data.get('cedula_estudiante'),
                materia_id=materia.id,
                descripcion=eval.get('description'),
                peso_porcentaje=float(eval.get('weight') or 0),
                puntaje=float(eval.get('score') or 0)
            )
            db.session.add(nueva_nota)
        
        db.session.commit()
        return jsonify({"message": "Notas guardadas correctamente"}), 201
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": str(e)}), 500
    
@academic_bp.route('/api/notas_estudiante/<cedula>/<semestre>', methods=['GET'])
def consultar_notas(cedula, semestre):
    try:
        # Buscamos las notas del estudiante filtradas por el semestre de la materia
        notas = db.session.query(Nota, Materia).join(Materia).filter(
            Nota.estudiante_cedula == cedula,
            Materia.semestre == semestre
        ).all()

        if not notas:
            return jsonify({"mensaje": "No se encontraron notas"}), 404

        # Estructuramos los datos como los espera el frontend
        materias_dict = {}
        for nota, materia in notas:
            if materia.nombre not in materias_dict:
                materias_dict[materia.nombre] = {
                    "nombre": materia.nombre,
                    "evaluaciones": [],
                    "notaFinal": 0
                }
            
            materias_dict[materia.nombre]["evaluaciones"].append({
                "descripcion": nota.descripcion, # Antes decía 'descripcion'
                "puntaje": nota.puntaje,        # Antes decía 'puntaje'
                "peso": nota.peso_porcentaje    # Antes decía 'peso'
            })
            # Sumamos la contribución a la nota final
            materias_dict[materia.nombre]["notaFinal"] += (nota.puntaje * (nota.peso_porcentaje / 100))

        return jsonify({
            "nombre": "Estudiante UNEXCA", # Aquí podrías buscar el nombre en una tabla de Usuarios
            "materias": list(materias_dict.values())
        }), 200
        
    except Exception as e:
        return jsonify({"error": str(e)}), 500