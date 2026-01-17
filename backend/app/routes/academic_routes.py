from flask import Blueprint, jsonify
from app.models.academic import Materia
from app.extensions import db

# aqui organizamos las rutas 
academic_bp = Blueprint('academic', __name__)

@academic_bp.route('/api/materias', methods=['GET'])
def obtener_materias():
    materias = Materia.query.all()# <---- aqui buscamos todas las materias en la base de datos
    
    resultado = [] # <- Convierte la informacion en JSON
    for materia in materias:
        resultado.append({
            "id": materia.id,
            "nombre": materia.nombre,
            "horario": materia.horario
        })
        
    return jsonify(resultado)