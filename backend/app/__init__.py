from flask import Flask
from flask_cors import CORS
from app.extensions import db # Importamos la db neutral


def create_app():
    app = Flask(__name__)
    CORS(app)
    
    # Configuración
    app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://postgres:123456789@localhost:5432/grestion_notas_unexca'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    
    # Esta es la línea mágica que el error te pide:
    db.init_app(app)
    
    # Registra tus rutas
    from app.routes.academic_routes import academic_bp
    app.register_blueprint(academic_bp)
    
    return app





