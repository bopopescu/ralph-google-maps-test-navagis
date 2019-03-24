# app/api/resources/restaurants.py

from flask import jsonify
from flask_restful import Resource, reqparse
from app.models import db, Restaurant, UserOrder, RestaurantCategory
from sqlalchemy.orm.exc import NoResultFound

from sqlalchemy.dialects import mysql

# from sqlalchemy.func import sum


class Restaurants(Resource):
    def get(self, category_id=None):

        try:
            restaurants_list = []

            if category_id is not None and category_id > 0:

                restaurant_id_list = []

                db_restaurant_list_obj = (
                    db.session.query(Restaurant)
                    .join(RestaurantCategory)
                    .filter(RestaurantCategory.id == category_id)
                ).all()

                for restaurant in db_restaurant_list_obj:
                    restaurant_id_list.append(restaurant.id)

                db_query_obj = (
                    db.session.query(
                        Restaurant,
                        db.func.count(UserOrder.restaurant_id).label("total_visit"),
                    )
                    .join(RestaurantCategory)
                    .outerjoin(UserOrder)
                    .filter(UserOrder.restaurant_id.in_(restaurant_id_list))
                    .group_by(Restaurant.id)
                )
            else:
                db_query_obj = (
                    db.session.query(
                        Restaurant,
                        db.func.count(UserOrder.restaurant_id).label("total_visit"),
                    )
                    .join(RestaurantCategory)
                    .join(UserOrder)
                    .group_by(Restaurant.id)
                )

            # checkl SQL output
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

