# config.py


class Config(object):
    """
    Set Parent configurations here
    """


class DevelopmentConfig(Config):
    """
    Set Development configurations here
    """
    DEBUG = True
    SQLALCHEMY_ECHO = True


class ProductionConfig(Config):
    """
    Set Production configurations here
    """
    DEBUG = False


app_config = {
    'development': DevelopmentConfig
}
