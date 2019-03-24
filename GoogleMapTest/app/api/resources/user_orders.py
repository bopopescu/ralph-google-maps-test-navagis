# app/api/resources/user_orders.py

import json

from flask import jsonify, request
from flask_restful import Resource, reqparse
from app.models import db, Restaurant, UserOrder, RestaurantCategory
from sqlalchemy.orm.exc import NoResultFound
from sqlalchemy.dialects import mysql
from schema import Schema, And, Use


class UserOrders(Resource):
    def get(self):

        try:
            top_seller_obj = (
                db.session.query(
                    Restaurant,
                    UserOrder,
                    db.func.sum(
                        UserOrder.total_quantity * UserOrder.menu_last_price
                    ).label("top_revenue"),
                )
                .join(Restaurant)
                .group_by(Restaurant.id)
                .order_by(
                    db.func.sum(
                        UserOrder.total_quantity * UserOrder.menu_last_price
                    ).desc()
                )
            )

            # check SQL output
            query_string_test = str(
                top_seller_obj.statement.compile(dialect=mysql.dialect())
            )

            top_restaurant_record = top_seller_obj.all()
            top_restaurant_result = []
            top_seller = None
            top_seller_revenue = 0
            total_restaurants = 0
            total_revenue = 0

            restaurant_idx = 0

            for restaurant_record in top_restaurant_record:

                if restaurant_idx == 0:
                    top_seller = restaurant_record.Restaurant.name
                    top_seller_revenue = restaurant_record.top_revenue

                restaurant_idx += 1
                total_restaurants += 1
                total_revenue += restaurant_record.top_revenue

            statistics_data = {
                "top_seller": top_seller,
                "top_seller_revenue": top_seller_revenue,
                "total_restaurants": total_restaurants,
                "total_revenue": total_revenue,
            }

            status = 200
            message = "success"
            result = statistics_data

        except NoResultFound as excptNoResult:

            status = 204
            message = "error"
            result = str(excptNoResult)

        return jsonify({"status": status, "message": message, "result": result})

    def post(self):

        validation_schema = Schema(
            {
                "menu_id": int,
                "menu_last_price": float,
                "restaurant_id": int,
                "total_quantity": int,
            }
        )

        try:

            if request.data is not None and (len(request.data) > 0):
                obj_data = json.loads(request.data)
                obj_data["menu_last_price"] = float(obj_data["menu_last_price"])
                validated = validation_schema.validate(obj_data)

                new_order_obj = UserOrder(
                    restaurant_id=obj_data["restaurant_id"],
                    menu_id=obj_data["menu_id"],
                    menu_last_price=obj_data["menu_last_price"],
                    total_quantity=obj_data["total_quantity"],
                )

                db.session.add(new_order_obj)

                db.session.commit()

                status = 200
                message = "success"
                result = "Order successful"

        except Exception as e:
            status = 400
            message = "error"
            result = str(excptNoResult)

        return jsonify({"status": status, "message": message, "result": result})
