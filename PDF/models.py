from app import db
from sqlalchemy.orm import Mapped, mapped_column

#Modelo de datos
class Cursos(db.Model):
    # que tenga un objeto id, de tipo entero, que sea una columna y que sea primaria
    id: Mapped[int] = mapped_column(primary_key=True)
    nombre: Mapped[str] = mapped_column(unique=True)
    instructor: Mapped[str]
    topico: Mapped[str]
    
    def __str__(self):
        return(
            f'Id:{self.id}, '
            f'Nombre:{self.nombre}, '
            f'Instructor:{self.instructor}, '
            f'Topico:{self.topico}'
        )
    