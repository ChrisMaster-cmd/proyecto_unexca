# backend/app/models/academic.py
from app.extensions import db

class Materia(db.Model):
    __tablename__ = 'materias'
    id = db.Column(db.Integer, primary_key=True)
    nombre = db.Column(db.String(120), nullable=False)
    # Añadimos esta columna que falta
    semestre = db.Column(db.String(10), nullable=False) 
    horario = db.Column(db.String(100), nullable=True)
    profesor_cedula = db.Column(db.String(20), nullable=True)

class Nota(db.Model):
    __tablename__ = 'notas'
    id = db.Column(db.Integer, primary_key=True)
    estudiante_cedula = db.Column(db.String(20), nullable=False)
    materia_id = db.Column(db.Integer, db.ForeignKey('materias.id'), nullable=False)
    descripcion = db.Column(db.String(100))
    peso_porcentaje = db.Column(db.Float)
    puntaje = db.Column(db.Float)