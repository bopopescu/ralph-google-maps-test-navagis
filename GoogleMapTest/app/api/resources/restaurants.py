# app/api/resources/restaurants.py

import json

from flask import jsonify, request
from flask_restful import Resource
from app.models import db, Restaurant, UserOrder, RestaurantCategory, RestaurantMenu
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.dialects import mysql
from schema import Schema


class Restaurants(Resource):
    def get(self, param_id=None):

        try:
            restaurants_list = []
            category_id = param_id

            if category_id is not None and category_id > 0:
                db_query_obj = (
                    db.session.query(
                        Restaurant,
                        db.func.count(UserOrder.restaurant_id).label("total_visit"),
                    )
                    .outerjoin(UserOrder)
                    .join(RestaurantCategory)
                    .filter(RestaurantCategory.id == category_id)
                    .group_by(Restaurant.id)
                )
            else:
                db_query_obj = (
                    db.session.query(
                        Restaurant,
                        db.func.count(UserOrder.restaurant_id).label("total_visit"),
                    )
                    .outerjoin(UserOrder)
                    .join(RestaurantCategory)
                    .group_by(Restaurant.id)
                )

            # check SQL output
            query_string_test = str(
                db_query_obj.statement.compile(dialect=mysql.dialect())
            )

            restaurant_rows = db_query_obj.all()

            for restaurant_loop in restaurant_rows:
                restaurant = restaurant_loop[0]
                restaurant_details = {
                    "id": restaurant.id,
                    "name": restaurant.name,
                    "address": restaurant.address,
                    "total_visit": restaurant_loop.total_visit,
                    "pos": {"lng": restaurant.lng, "lat": restaurant.lat},
                    "category": {
                        "id": restaurant.restaurant_category.id,
                        "name": restaurant.restaurant_category.name,
                    },
                }
                restaurants_list.append(restaurant_details)

            status = 200
            message = "success"
            result = restaurants_list

        except NoResultFound as excptNoResult:

            status = 204
            message = "error"
            result = str(excptNoResult)

        return jsonify({"status": status, "message": message, "result": result})

    def post(self):
        
        validation_schema = Schema(
            {
                "restaurant": {
                    "name": str,
                    "address": str,
                    "lng": float,
                    "lat": float,
                    "restaurant_category_id": int
                },
                "menu": {
                    "name": str,
                    "price": float
                }
            }
        )

        try:
            if request.data is not None and (len(request.data) > 0):
                obj_data = json.loads(request.data)
                obj_data["restaurant"]["lng"] = float(obj_data["restaurant"]["lng"])
                obj_data["restaurant"]["lat"] = float(obj_data["restaurant"]["lat"])
                obj_data["menu"]["price"] = float(obj_data["menu"]["price"])

                validated = validation_schema.validate(obj_data)

                obj_data = json.loads(request.data)
                obj_data["restaurant"]["lng"] = float(obj_data["restaurant"]["lng"])
                obj_data["restaurant"]["lat"] = float(obj_data["restaurant"]["lat"])
                obj_data["menu"]["price"] = float(obj_data["menu"]["price"])

                # Create restaurant
                new_restaurant = Restaurant(**obj_data["restaurant"])
                db.session.add(new_restaurant)
                db.session.commit()
                db.session.refresh(new_restaurant)

                # Create restaurant menu
                new_restaurant_menu = RestaurantMenu(**obj_data["menu"])
                new_restaurant_menu.restaurant_id = new_restaurant.id
                db.session.add(new_restaurant_menu)
                db.session.commit()

                status = 200
                message = "success"
                result = "Restaurant details created"

        except Exception as e:

            status = 400
            message = "error"
            result = str(e)

        return jsonify({"status": status, "message": message, "result": result})

    def delete(self, param_id):

        restaurant_id = param_id

        try:

            # Delete from user_orders table
            UserOrder.query.filter(UserOrder.restaurant_id == restaurant_id).delete()

            # Delete from restaurant_menu table
            RestaurantMenu.query.filter(RestaurantMenu.restaurant_id == restaurant_id).delete()

            # Delete from restaurant table
            Restaurant.query.filter(Restaurant.id == restaurant_id).delete()

            db.session.commit()

            status = 200
            message = "success"
            result = "Restaurant details deleted"

        except Exception as e:

            status = 400
            message = "error"
            result = str(e)

        return jsonify({"status": status, "message": message, "result": result})
