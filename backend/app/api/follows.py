from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api
from app.models import User, Friendship, FriendRequest
from app import db
from datetime import datetime

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

# 发送好友申请
@api.route('/friends/request', methods=['POST'])
@jwt_required()
def send_friend_request():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    receiver_id = data.get('receiver_id')
    
    if not receiver_id:
        return jsonify({'error': '接收者ID不能为空'}), 400
        
    # 检查是否已经是好友
    existing_friendship = Friendship.query.filter(
        db.or_(
            db.and_(Friendship.user_id == current_user_id, Friendship.friend_id == receiver_id),
            db.and_(Friendship.user_id == receiver_id, Friendship.friend_id == current_user_id)
        )
    ).first()
    
    if existing_friendship:
        return jsonify({'error': '已经是好友关系'}), 400
        
    # 检查是否已经发送过申请
    existing_request = FriendRequest.query.filter_by(
        sender_id=current_user_id,
        receiver_id=receiver_id,
        status='pending'
    ).first()
    
    if existing_request:
        return jsonify({'error': '已经发送过好友申请'}), 400
        
    friend_request = FriendRequest(
        sender_id=current_user_id,
        receiver_id=receiver_id
    )
    
    db.session.add(friend_request)
    db.session.commit()
    
    return jsonify({'message': '好友申请已发送'})

# 处理好友申请
@api.route('/friends/request/<int:request_id>', methods=['PUT'])
@jwt_required()
def handle_friend_request(request_id):
    current_user_id = get_jwt_identity()
    data = request.get_json()
    action = data.get('action')  # accept 或 reject
    
    friend_request = FriendRequest.query.get_or_404(request_id)
    
    print(f"DEBUG: friend_request.receiver_id: {friend_request.receiver_id}, type: {type(friend_request.receiver_id)}")
    print(f"DEBUG: current_user_id: {current_user_id}, type: {type(current_user_id)}")

    # 将current_user_id转换为整数进行比较
    if friend_request.receiver_id != int(current_user_id):
        return jsonify({'error': '无权处理此申请'}), 403
        
    if friend_request.status != 'pending':
        return jsonify({'error': '此申请已处理'}), 400
        
    if action == 'accept':
        # 创建双向好友关系
        friendship1 = Friendship(user_id=current_user_id, friend_id=friend_request.sender_id)
        friendship2 = Friendship(user_id=friend_request.sender_id, friend_id=current_user_id)
        
        db.session.add(friendship1)
        db.session.add(friendship2)
        friend_request.status = 'accepted'
        
    elif action == 'reject':
        friend_request.status = 'rejected'
        
    else:
        return jsonify({'error': '无效的操作'}), 400
        
    db.session.commit()
    return jsonify({'message': '好友申请已处理'})

# 获取好友列表
@api.route('/friends', methods=['GET'])
@jwt_required()
def get_friends():
    current_user_id = get_jwt_identity()
    
    friendships = Friendship.query.filter_by(user_id=current_user_id).all()
    
    friends = []
    for friendship in friendships:
        friend = User.query.get(friendship.friend_id)
        friends.append({
            'id': friend.id,
            'username': friend.username,
            'nickname': friend.nickname,
            'avatar': friend.avatar
        })
        
    return jsonify(friends)

# 获取好友申请列表
@api.route('/friends/requests', methods=['GET'])
@jwt_required()
def get_friend_requests():
    current_user_id = get_jwt_identity()
    
    friend_requests = FriendRequest.query.filter_by(
        receiver_id=current_user_id,
        status='pending'
    ).all()
    
    requests_data = []
    for req in friend_requests:
        sender = User.query.get(req.sender_id)
        if sender:
            requests_data.append({
                'id': req.id,
                'sender_id': req.sender_id,
                'receiver_id': req.receiver_id,
                'status': req.status,
                'timestamp': req.created_at.isoformat(),
                'sender': {
                    'id': sender.id,
                    'username': sender.username,
                    'nickname': sender.nickname,
                    'avatar': sender.avatar
                }
            })
            
    return jsonify(requests_data)

# 获取未处理好友申请数量
@api.route('/friends/requests/count', methods=['GET'])
@jwt_required()
def get_pending_friend_requests_count():
    current_user_id = get_jwt_identity()
    count = FriendRequest.query.filter_by(
        receiver_id=current_user_id,
        status='pending'
    ).count()
    return jsonify({'count': count})

# 删除好友
@api.route('/friends/<int:friend_id>', methods=['DELETE'])
@jwt_required()
def delete_friend(friend_id):
    current_user_id = get_jwt_identity()
    
    # 查找并删除双向好友关系
    friendship1 = Friendship.query.filter_by(user_id=current_user_id, friend_id=friend_id).first()
    friendship2 = Friendship.query.filter_by(user_id=friend_id, friend_id=current_user_id).first()
    
    if not friendship1 and not friendship2:
        return jsonify({'error': '好友关系不存在'}), 404
        
    if friendship1:
        db.session.delete(friendship1)
    if friendship2:
        db.session.delete(friendship2)
        
    db.session.commit()
    return jsonify({'message': '好友已删除'})