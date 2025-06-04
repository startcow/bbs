from flask import jsonify, request
from . import api
from app.models import Forum

@api.route('/forums', methods=['GET'])
def get_forums():
    forums = Forum.query.all()
    return jsonify({
        'forums': [forum.to_dict() for forum in forums]
    })

@api.route('/forums/<int:forum_id>', methods=['GET'])
def get_forum(forum_id):
    forum = Forum.query.get_or_404(forum_id)
    return jsonify(forum.to_dict())

@api.route('/forums/<int:forum_id>/posts', methods=['GET'])
def get_forum_posts(forum_id):
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 20, type=int)
    sort_by = request.args.get('sort_by', 'latest')
    
    return jsonify({'message': f'获取板块 {forum_id} 的帖子列表'})