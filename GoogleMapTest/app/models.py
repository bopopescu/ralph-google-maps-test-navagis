# app/models.py

# coding: utf-8
from sqlalchemy import Column, Float, ForeignKey, String, TIMESTAMP, text
from sqlalchemy.dialects.mysql import INTEGER
from sqlalchemy.orm import relationship

from flask_sqlalchemy import SQLAlchemy


db = SQLAlchemy()


class RestaurantCategory(db.Model):
    __tablename__ = "restaurant_category"

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(45))


class Restaurant(db.Model):
    __tablename__ = "restaurant"

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(124))
    address = Column(String(512))
    lat = Column(Float(10))
    lng = Column(Float(10))
    restaurant_category_id = Column(
        ForeignKey("restaurant_category.id"), nullable=False, index=True
    )

    restaurant_category = relationship("RestaurantCategory")


class RestaurantMenu(db.Model):
    __tablename__ = "restaurant_menu"

    id = Column(INTEGER(11), primary_key=True)
    name = Column(String(256))
    restaurant_id = Column(ForeignKey("restaurant.id"), nullable=False, index=True)
    price = Column(Float(10))
    date_added = Column(TIMESTAMP, server_default=text("CURRENT_TIMESTAMP"))

    restaurant = relationship("Restaurant")


class UserOrder(db.Model):
    __tablename__ = "user_orders"

    id = Column(INTEGER(11), primary_key=True)
    restaurant_id = Column(ForeignKey("restaurant.id"), index=True)
    menu_id = Column(ForeignKey("restaurant_menu.id"), index=True)
    menu_last_price = Column(Float(10))
    total_quantity = Column(INTEGER(11))
    visit_timestamp = Column(String(45))

    menu = relationship("RestaurantMenu")
    restaurant = relationship("Restaurant")

