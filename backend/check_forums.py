import sys
import os

# Add the backend directory to the system path to enable importing app
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app, db
from app.models import Forum, Post # 导入 Post 模型
from sqlalchemy import func

# Attempt to create the Flask app
try:
    app = create_app()
except ImportError:
    # Fallback if create_app is not defined in app/__init__.py,
    # assuming the app instance is directly available as 'app'
    from app import app # type: ignore

# 获取命令行参数中的板块ID
forum_id = None
if len(sys.argv) > 1:
    try:
        forum_id = int(sys.argv[1])
    except ValueError:
        print("Invalid forum ID provided.")
        sys.exit(1)

if forum_id is None:
    print("Please provide a forum ID as a command line argument.")
    sys.exit(1)

with app.app_context():
    # 查询特定板块下的所有帖子数量
    post_count = Post.query.filter_by(forum_id=forum_id).count()
    print(f"Forum ID {forum_id} has {post_count} posts.")

    # （可选）查询并打印所有帖子标题
    # posts = Post.query.filter_by(forum_id=forum_id).all()
    # print("Posts in this forum:")
    # for post in posts:
    #     print(f"- {post.title}") 