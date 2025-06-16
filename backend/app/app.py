from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_cors import CORS # 导入 CORS
import os

db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app():
    app = Flask(__name__)

    # 从环境变量或config.py加载配置
    app.config.from_object('config.Config') # 确保这里加载了配置

    # 初始化扩展
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    CORS(app)  # 初始化 CORS，允许所有来源，或者您可以配置特定来源

    from .models import user, post, comment, friendship, message # 导入所有模型，确保它们被迁移发现
    from .api import auth, posts, comments, forums, follows, search, messages # 导入蓝图

    # 注册蓝图
    app.register_blueprint(auth.bp, url_prefix='/api/auth')
    app.register_blueprint(posts.bp, url_prefix='/api/posts')
    app.register_blueprint(comments.bp, url_prefix='/api/comments')
    app.register_blueprint(forums.bp, url_prefix='/api/forums')
    app.register_blueprint(follows.bp, url_prefix='/api/friends') # 保持friends作为前缀
    app.register_blueprint(search.bp, url_prefix='/api/users')  # 保持users作为前缀
    app.register_blueprint(messages.bp, url_prefix='/api/messages') # 注册messages蓝图

    # 添加一个简单的根路由，用于测试
    @app.route('/')
    def index():
        return "Welcome to the BBS API!"

    return app 