from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
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

@api.route('/forums', methods=['POST'])
@jwt_required()
def create_forum():
    """创建新板块"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get_or_404(current_user_id)
        
        # 检查权限：只有管理员可以创建板块
        if current_user.role != 'admin':
            return jsonify({'message': '权限不足，只有管理员可以创建板块'}), 403
        
        data = request.get_json()
        
        # 验证必填字段
        if not data.get('name'):
            return jsonify({'message': '板块名称不能为空'}), 400
        
        if not data.get('description'):
            return jsonify({'message': '板块描述不能为空'}), 400
        
        # 检查板块名称是否已存在
        existing_forum = Forum.query.filter_by(name=data['name']).first()
        if existing_forum:
            return jsonify({'message': '板块名称已存在'}), 400
        
        # 创建新板块
        new_forum = Forum(
            name=data['name'],
            description=data['description'],
            icon=data.get('icon', 'fa-comments'),
            moderator_id=data.get('moderator_id')
        )
        
        db.session.add(new_forum)
        db.session.commit()
        
        return jsonify({
            'message': '板块创建成功',
            'forum': new_forum.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'创建板块失败: {str(e)}'}), 500

@api.route('/forums/<int:forum_id>/moderators', methods=['POST'])
@jwt_required()
def add_moderator(forum_id):
    """添加版主"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get_or_404(current_user_id)
        
        # 检查权限：只有管理员可以添加版主
        if current_user.role != 'admin':
            return jsonify({'message': '权限不足，只有管理员可以添加版主'}), 403
        
        data = request.get_json()
        user_id = data.get('user_id')
        
        if not user_id:
            return jsonify({'message': '用户ID不能为空'}), 400
        
        # 检查板块是否存在
        forum = Forum.query.get_or_404(forum_id)
        
        # 检查用户是否存在
        user = User.query.get_or_404(user_id)
        
        # 刷新数据库会话以确保数据一致性
        db.session.refresh(forum)
        
        # 检查板块是否已有版主
        print(f"Debug: Forum {forum.name} (id={forum.id}) moderator_id = {forum.moderator_id}")
        if forum.moderator_id:
            return jsonify({'message': f'该板块已有版主 (moderator_id: {forum.moderator_id})'}), 400
        
        # 检查用户是否已经是其他板块的版主
        if user.role == 'moderator':
            return jsonify({'message': '该用户已经是其他板块的版主'}), 400
        
        # 设置板块的版主
        forum.moderator_id = user_id
        
        # 将用户角色改为版主
        user.role = 'moderator'
        
        db.session.commit()
        
        # 确认数据库更改
        db.session.refresh(forum)
        print(f"Debug: After commit, forum {forum.name} moderator_id = {forum.moderator_id}")
        
        return jsonify({
            'message': '添加版主成功',
            'user': user.to_dict(),
            'forum': forum.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'添加版主失败: {str(e)}'}), 500

@api.route('/forums/<int:forum_id>/moderators/<int:user_id>', methods=['DELETE'])
@jwt_required()
def remove_moderator(forum_id, user_id):
    """删除版主"""
    try:
        current_user_id = get_jwt_identity()
        current_user = User.query.get_or_404(current_user_id)
        
        # 检查权限：只有管理员可以删除版主
        if current_user.role != 'admin':
            return jsonify({'message': '权限不足，只有管理员可以删除版主'}), 403
        
        # 检查板块是否存在
        forum = Forum.query.get_or_404(forum_id)
        
        # 检查用户是否存在
        user = User.query.get_or_404(user_id)
        
        # 检查用户是否是该板块的版主
        if forum.moderator_id != user_id:
            return jsonify({'message': '该用户不是此板块的版主'}), 400
        
        # 设置板块的版主为空
        print(f"Debug: Removing moderator from forum {forum.name} (id={forum.id}), old moderator_id = {forum.moderator_id}")
        forum.moderator_id = None
        print(f"Debug: After setting to None, moderator_id = {forum.moderator_id}")
        
        # 检查用户是否还是其他板块的版主
        other_moderated_forums = Forum.query.filter_by(moderator_id=user_id).count()
        
        # 如果用户不再是任何板块的版主，将角色改回普通用户
        if other_moderated_forums == 0:
            user.role = 'user'
        
        db.session.commit()
        
        # 确认数据库更改
        db.session.refresh(forum)
        print(f"Debug: After commit, forum {forum.name} moderator_id = {forum.moderator_id}")
        
        return jsonify({
            'message': '移除版主成功',
            'user': user.to_dict(),
            'forum': forum.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'删除版主失败: {str(e)}'}), 500
