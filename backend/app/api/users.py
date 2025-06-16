from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api
from app.models import User
from app import db

@api.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """获取用户列表"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get_or_404(current_user_id)
        
        # 获取查询参数
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        role = request.args.get('role', type=str)
        
        # 检查权限：管理员可以查看所有用户，普通用户只能查看role为user的用户
        if current_user.role == 'admin':
            # 管理员可以查看所有用户
            pass
        else:
            # 普通用户只能查看role为user的用户（用于版主管理等功能）
            if not role:
                role = 'user'  # 默认只显示普通用户
            elif role != 'user':
                return jsonify({'message': '权限不足，只能查看普通用户'}), 403
        
        # 构建查询
        query = User.query
        
        if role:
            query = query.filter_by(role=role)
        
        # 分页查询
        users = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'message': f'获取用户列表失败: {str(e)}'}), 500