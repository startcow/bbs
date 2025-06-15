from flask import Blueprint

api = Blueprint('api', __name__)


from . import auth, users, posts, forums, spider, search, follows

