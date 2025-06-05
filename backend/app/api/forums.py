from flask import jsonify, request
from . import api
from app.models import Forum
from app import db
import sqlalchemy

@api.route('/forums', methods=['GET'])
def get_forums():
    sort_by = request.args.get('sort_by', 'latest', type=str)

    # 构建查询以按名称分组并计算总帖子数量
    query = db.session.query(
        Forum.name,
        db.func.sum(Forum.post_count).label('total_post_count'),
        db.func.min(Forum.icon).label('icon'),
        db.func.min(Forum.description).label('description'),
        db.func.min(Forum.id).label('id')
    ).group_by(Forum.name, Forum.icon, Forum.description)

    # 应用排序
    if sort_by == 'latest':
         query = query.order_by(db.func.sum(Forum.post_count).desc())
    elif sort_by == 'popular':
        query = query.order_by(db.func.sum(Forum.post_count).desc())

    # 执行查询并获取结果
    grouped_forums_data = query.all()

    # 将查询结果转换为字典列表，以便前端使用
    processed_forums = []
    for name, total_post_count, icon, description, id in grouped_forums_data:
        processed_forums.append({
            'id': id,
            'name': name,
            'total_post_count': total_post_count,
            'icon': icon,
            'description': description
        })

    return jsonify({
        'forums': processed_forums
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