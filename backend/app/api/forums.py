from flask import jsonify, request
from . import api
from app.models import Forum

@api.route('/forums', methods=['GET'])
def get_forums():
    sort_by = request.args.get('sort_by', 'latest', type=str)

    query = Forum.query

    if sort_by == 'latest':
        # 默认按ID排序，或者您可以根据需求调整默认排序
        query = query.order_by(Forum.id.asc())
    elif sort_by == 'popular':
        # 按帖子数量降序排序
        query = query.order_by(Forum.post_count.desc())
    # 可以添加更多排序选项

    forums = query.all()
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