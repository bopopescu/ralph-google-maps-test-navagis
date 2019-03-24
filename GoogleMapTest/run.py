# app/run.py

import os

from app import create_app

# detect flask config value for setting the config name. This value is set in OS env
config_name = os.getenv('FLASK_CONFIG')

# instantiate app object from class factory
config_name = 'development'
app = create_app(config_name)


# Detect if this is ran as main script or imported as module. Run app if it's main script
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=int("5000"), debug=True)
