from app import create_app
from app.extensions import db  # Solo importamos db desde aquí
from app.models.academic import Materia, Nota

app = create_app()

with app.app_context():

    db.create_all()
    print("Base de datos verificada/creada.")

    if Materia.query.count() == 0:
        prueba = Materia(
            nombre="Programacion 1", 
            semestre="1",
            horario="Lunes 8:00 AM - 10:00 AM", 
            profesor_cedula="12345"
        )
        db.session.add(prueba)
        db.session.commit()
        print("Materia de prueba creada con exito")

if __name__ == '__main__':
    app.run(debug=True)