from flask import Blueprint

api = Blueprint('api', __name__)


from . import auth, users, posts, follows, search, messages, spider, forums

