from flask import jsonify, request
from . import api
from ..models.post import Post
from ..models.user import User
from ..models.forum import Forum
from sqlalchemy import or_

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