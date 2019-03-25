# app/api/resources/restaurant_form.py

from flask import jsonify
from flask_restful import Resource
from app.models import db, Restaurant, RestaurantMenu, RestaurantCategory
from sqlalchemy.orm.exc import NoResultFound


class Categories(Resource):

    def get(self, category_id=None):

        try:

            categories_list = []

            obj_categories_list = db.session.query(RestaurantCategory)

            if category_id is not None:
                obj_categories_list = obj_categories_list.filter(RestaurantCategory.id == category_id)

            obj_categories_list_result = obj_categories_list.all()

            for category_result_item in obj_categories_list_result:
                list_row = {
                    "id": category_result_item.id,
                    "name": category_result_item.name
                }
                categories_list.append(list_row)

            status = 200
            message = "success"
            result = categories_list

        except NoResultFound as excptNoResult:

            status = 204
            message = "error"
            result = str(excptNoResult)

        return jsonify({"status": status, "message": message, "result": result})

