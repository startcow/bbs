from app import create_app
from flask_migrate import Migrate
from app import db
import sys

app = create_app()
migrate = Migrate(app, db)

if __name__ == '__main__':
    try:
        app.run(debug=True, host='127.0.0.1', port=8080)
    except Exception as e:
        print(f"启动服务器时发生错误: {str(e)}", file=sys.stderr)
        sys.exit(1)