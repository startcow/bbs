from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api
from app.models import User
from app import db

@api.route('/users/<int:user_id>/follow', methods=['POST'])
@jwt_required()
def follow_user(user_id):
    """关注用户"""
    try:
        current_user_id = get_jwt_identity()
        
        # 不能关注自己
        if current_user_id == user_id:
            return jsonify({'message': '不能关注自己'}), 400
        
        current_user = User.query.get_or_404(current_user_id)
        target_user = User.query.get_or_404(user_id)
        
        if current_user.is_following(target_user):
            # 取消关注
            current_user.unfollow(target_user)
            db.session.commit()
            return jsonify({
                'message': '取消关注成功',
                'is_following': False,
                'followers_count': target_user.get_followers_count()
            })
        else:
            # 关注
            current_user.follow(target_user)
            db.session.commit()
            return jsonify({
                'message': '关注成功',
                'is_following': True,
                'followers_count': target_user.get_followers_count()
            })
            
    except Exception as e:
        db.session.rollback()
        return jsonify({'message': f'操作失败: {str(e)}'}), 500

@api.route('/users/<int:user_id>/followers', methods=['GET'])
@jwt_required()
def get_user_followers(user_id):
    """获取用户的粉丝列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        user = User.query.get_or_404(user_id)
        current_user_id = get_jwt_identity()
        
        followers = user.followers.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'followers': [follower.to_dict(current_user_id) for follower in followers.items],
            'total': followers.total,
            'pages': followers.pages,
            'current_page': followers.page
        })
        
    except Exception as e:
        return jsonify({'message': f'获取粉丝列表失败: {str(e)}'}), 500

@api.route('/users/<int:user_id>/following', methods=['GET'])
@jwt_required()
def get_user_following(user_id):
    """获取用户的关注列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 20, type=int)
        
        user = User.query.get_or_404(user_id)
        current_user_id = get_jwt_identity()
        
        following = user.following.paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'following': [followed.to_dict(current_user_id) for followed in following.items],
            'total': following.total,
            'pages': following.pages,
            'current_page': following.page
        })
        
    except Exception as e:
        return jsonify({'message': f'获取关注列表失败: {str(e)}'}), 500

@api.route('/users/<int:user_id>/stats', methods=['GET'])
def get_user_stats(user_id):
    """获取用户统计信息"""
    try:
        user = User.query.get_or_404(user_id)
        
        return jsonify({
            'following_count': user.get_following_count(),
            'followers_count': user.get_followers_count()
        })
        
    except Exception as e:
        return jsonify({'message': f'获取用户统计失败: {str(e)}'}), 500