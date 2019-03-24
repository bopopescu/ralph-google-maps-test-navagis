# __init__.py

# import external modules/libraries
from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

db = SQLAlchemy()

# import local modules/libraries
from app.config import app_config

# compose app object using object factory approach
def create_app(config_name):

    # Create Flask instance
    app = Flask(__name__, instance_relative_config=True)
    app.url_map.strict_slashes = False
    cors = CORS(app, resources={r"/api/*": {"origins": "*"}})

    # load object configurations from app/config.py
    app.config.from_object(app_config[config_name])

    # load configurations from instance folder
    app.config.from_pyfile("config.py")

    @app.route("/test_endpoint")
    def test_endpoint():
        a = 1
        b = 2
        c = 2
        return "server is running!!!"

    from app.api import api_blueprint

    app.register_blueprint(api_blueprint, url_prefix="/api")

    from app.models import db

    migrate = Migrate(app, db)

    db.init_app(app)

    return app

