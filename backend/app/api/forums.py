from flask import jsonify, request
from . import api
from app.models import Forum, Post, User
from app import db
import sqlalchemy
from datetime import datetime, date

@api.route('/forums', methods=['GET'])
def get_forums():
    try:
        sort_by = request.args.get('sort_by', 'latest', type=str)
        
        # 获取今天的日期范围
        today = date.today()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())

        # 获取所有板块（按名称去重）
        forums_query = db.session.query(
            Forum.name,
            db.func.min(Forum.icon).label('icon'),
            db.func.min(Forum.description).label('description'),
            db.func.min(Forum.id).label('id')
        ).group_by(Forum.name, Forum.icon, Forum.description)

        forums_data = forums_query.all()

        # 将查询结果转换为字典列表，以便前端使用
        processed_forums = []
        for name, icon, description, id in forums_data:
            # 计算该板块的实际总帖数（从Post表中统计）
            total_post_count = Post.query.filter_by(forum_id=id).count()
            
            # 计算今日新帖数
            today_posts_count = Post.query.filter(
                Post.forum_id == id,
                Post.created_at >= today_start,
                Post.created_at <= today_end
            ).count()
            
            processed_forums.append({
                'id': id,
                'name': name,
                'total_post_count': total_post_count or 0,
                'today_posts_count': today_posts_count,
                'icon': icon,
                'description': description
            })

        # 应用排序
        if sort_by == 'latest':
            processed_forums.sort(key=lambda x: x['total_post_count'], reverse=True)
        elif sort_by == 'popular':
            processed_forums.sort(key=lambda x: x['total_post_count'], reverse=True)

        return jsonify({
            'forums': processed_forums
        })
    except Exception as e:
        return jsonify({'message': f'获取板块列表失败: {str(e)}'}), 500

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

@api.route('/forums/stats', methods=['GET'])
def get_forum_stats():
    """获取论坛统计信息"""
    try:
        # 获取今天的日期范围
        today = date.today()
        today_start = datetime.combine(today, datetime.min.time())
        today_end = datetime.combine(today, datetime.max.time())
        
        # 统计总板块数（按名称去重）
        total_forums = db.session.query(Forum.name).distinct().count()
        
        # 统计总帖数
        total_posts = Post.query.count()
        
        # 统计总用户数
        total_users = User.query.count()
        
        # 统计版主数量（role为moderator的用户数）
        total_moderators = User.query.filter_by(role='moderator').count()
        
        # 统计今日新帖数
        today_posts = Post.query.filter(
            Post.created_at >= today_start,
            Post.created_at <= today_end
        ).count()
        
        return jsonify({
            'total_forums': total_forums,
            'total_posts': total_posts,
            'total_users': total_users,
            'total_moderators': total_moderators,
            'today_posts': today_posts
        })
        
    except Exception as e:
        return jsonify({'message': f'获取统计信息失败: {str(e)}'}), 500