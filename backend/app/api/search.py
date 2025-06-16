from flask import jsonify, request
from . import api
from ..models.post import Post
from ..models.user import User
from ..models.forum import Forum
from sqlalchemy import or_
from flask_jwt_extended import jwt_required, get_jwt_identity

@api.route('/search', methods=['GET'])
def search():
    try:
        keyword = request.args.get('keyword', '')
        if not keyword:
            return jsonify({
                'posts': [],
                'users': [],
                'forums': []
            })

        # 搜索帖子（标题和内容）
        posts = Post.query.filter(
            or_(
                Post.title.ilike(f'%{keyword}%'),
                Post.content.ilike(f'%{keyword}%')
            )
        ).limit(10).all()

        # 搜索用户（用户名和昵称）
        users = User.query.filter(
            or_(
                User.username.ilike(f'%{keyword}%'),
                User.nickname.ilike(f'%{keyword}%')
            )
        ).limit(5).all()

        # 搜索板块（名称和描述）
        forums = Forum.query.filter(
            or_(
                Forum.name.ilike(f'%{keyword}%'),
                Forum.description.ilike(f'%{keyword}%')
            )
        ).limit(5).all()

        return jsonify({
            'posts': [post.to_dict() for post in posts],
            'users': [user.to_dict() for user in users],
            'forums': [forum.to_dict() for forum in forums]
        })

    except Exception as e:
        return jsonify({'message': f'搜索失败: {str(e)}'}), 500

# 专门用于好友搜索的API
@api.route('/users/search', methods=['GET'])
@jwt_required()
def search_users_for_friends():
    current_user_id = get_jwt_identity()
    query = request.args.get('query', '')
    
    if not query:
        return jsonify({'error': '搜索关键词不能为空'}), 400
        
    users = User.query.filter(
        or_(
            User.username.ilike(f'%{query}%'),
            User.nickname.ilike(f'%{query}%')
        ),
        User.id != current_user_id
    ).all()
    
    return jsonify([{
        'id': user.id,
        'username': user.username,
        'nickname': user.nickname,
        'avatar': user.avatar
    } for user in users])