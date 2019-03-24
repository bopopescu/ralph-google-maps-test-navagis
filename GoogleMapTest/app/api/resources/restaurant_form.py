# app/api/resources/restaurant_form.py

from flask import jsonify
from flask_restful import Resource, reqparse
from app.models import db, Restaurant, RestaurantMenu, RestaurantCategory
from sqlalchemy.orm.exc import NoResultFound

from sqlalchemy.dialects import mysql


class RestaurantForm(Resource):
    def get(self, restaurant_id=None):

        try:            
            res_restaurant_form = (
                db.session.query(Restaurant)
                .join(RestaurantCategory)
                .join(RestaurantMenu)
                .filter(Restaurant.id == restaurant_id)
            ).first()

            res_restaurant_form_restaurant_category = res_restaurant_form.restaurant_category

            obj_return_form_data = {
                "restaurant": {
                    "id": res_restaurant_form.id,
                    "name": res_restaurant_form.name
                },
                "category": {
                    "id": res_restaurant_form_restaurant_category.id,
                    "name": res_restaurant_form_restaurant_category.name
                },
            }

            # Get only one specialty menu for now
            res_restaurant_menu = (
                db.session.query(RestaurantMenu).filter(
                    RestaurantMenu.id == res_restaurant_form.id
                )
            ).first()

            obj_return_form_data["menu"] = {
                "id": res_restaurant_menu.id,
                "name": res_restaurant_menu.name,
                "price": res_restaurant_menu.price,
            }

            status = 200
            message = "success"
            result = obj_return_form_data

        except NoResultFound as excptNoResult:

            status = 204
            message = "error"
            result = str(excptNoResult)

        return jsonify({"status": status, "message": message, "result": result})

