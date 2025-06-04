from flask import Blueprint

api = Blueprint('api', __name__)

# 导入所有路由
from . import auth, users, posts, forums