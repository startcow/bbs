from flask import jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from . import api
from app.models import User, Message
from app import db
from sqlalchemy import or_
from datetime import datetime

@api.route('/messages', methods=['POST'])
@jwt_required()
def send_message():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    receiver_id = data.get('receiver_id')
    content = data.get('content')

    if not receiver_id or not content:
        return jsonify({'error': '接收者ID和消息内容不能为空'}), 400

    if current_user_id == receiver_id:
        return jsonify({'error': '不能给自己发送消息'}), 400

    receiver = User.query.get(receiver_id)
    if not receiver:
        return jsonify({'error': '接收者用户不存在'}), 404

    message = Message(
        sender_id=current_user_id,
        receiver_id=receiver_id,
        content=content
    )
    db.session.add(message)
    db.session.commit()

    return jsonify({'message': '消息发送成功', 'data': message.to_dict()}), 201

@api.route('/messages/<int:other_user_id>', methods=['GET'])
@jwt_required()
def get_messages(other_user_id):
    try:
        current_user_id = get_jwt_identity()

        # 获取当前用户与other_user_id之间的所有消息
        messages = Message.query.filter(
            or_(
                (Message.sender_id == current_user_id) & (Message.receiver_id == other_user_id),
                (Message.sender_id == other_user_id) & (Message.receiver_id == current_user_id)
            )
        ).order_by(Message.timestamp).all()

        # 标记接收到的消息为已读
        for msg in messages:
            if msg.receiver_id == current_user_id and not msg.is_read:
                msg.is_read = True
        db.session.commit()

        return jsonify([msg.to_dict() for msg in messages])
    except Exception as e:
        db.session.rollback() # 如果有事务开始，回滚
        print(f"获取消息失败: {e}") # 打印详细错误到后端控制台
        return jsonify({'error': f'获取消息失败: {str(e)}'}), 500 