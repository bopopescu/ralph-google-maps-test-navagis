# app/api/__init__py

from flask import Blueprint
from flask_restful import Api
from app.api.resources.restaurants import Restaurants
from app.api.resources.restaurant_form import RestaurantForm
from app.api.resources.user_orders import UserOrders

api_blueprint = Blueprint("api", __name__)

# wrap the blue print as an API object
api = Api(api_blueprint)

# Restaurants endpoint
api.add_resource(Restaurants, "/restaurants", "/restaurants/<int:param_id>")

# Restaurant form endpoint
api.add_resource(RestaurantForm, "/restaurant_form/<int:restaurant_id>")

# User order endpoint
api.add_resource(UserOrders, "/orders")

