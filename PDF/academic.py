from app import db # esto es para importa de la base de datos

class Materia(db.Model):
    __tablename__ = 'materias'
    id = db.Colum(db.Integer, primary_key =True)
    nombre = db.Column(db.String(120), nulllable=False)
    horario = db.Column(db.String(100), nulllable=False)
    profesor_cedula = db.Column(db.String(20),) # Como esto es un modulo, se accedera a los profesores y alumnos por medio de la cedula en lugar de la ID
    
class Nota(db.Model):
    __tablename__ = 'notas'
    id = db.Column(db.Integer, primary_key=True)
    estudiante_cedula = db.Column(db.String(20), nulllable=False)# <---- acedemos al estudiante por su cedula
    materia_id = db.Column(db.Integer, db.ForeignKey('materias.id'))# <--- llave foranea aqui para las materias
    materia = db.relationship('Materia', backref='notas') # Acá conecta Materia directamente
    descripcion = db.Colum(db.String(100))
    peso_porcentaje = db.Column(db.Float)
    puntaje = db.Column(db.Float)