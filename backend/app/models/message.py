from datetime import datetime
from app import db

class Message(db.Model):
    """聊天消息模型"""
    __tablename__ = 'messages'

    id = db.Column(db.Integer, primary_key=True)
    sender_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    receiver_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, index=True)
    is_read = db.Column(db.Boolean, default=False)

    # 关系
    sender = db.relationship('User', foreign_keys=[sender_id], backref=db.backref('sent_messages', lazy='dynamic'))
    receiver = db.relationship('User', foreign_keys=[receiver_id], backref=db.backref('received_messages', lazy='dynamic'))

    def __repr__(self):
        return f'<Message {self.sender_id} -> {self.receiver_id}: {self.content[:20]}>'

    def to_dict(self):
        from .user import User # 局部导入以避免循环依赖
        
        sender_user = User.query.get(self.sender_id)
        receiver_user = User.query.get(self.receiver_id)

        return {
            'id': self.id,
            'sender_id': self.sender_id,
            'receiver_id': self.receiver_id,
            'content': self.content,
            'timestamp': self.timestamp.isoformat(),
            'is_read': self.is_read,
            'sender': {
                'id': sender_user.id,
                'username': sender_user.username,
                'nickname': sender_user.nickname,
                'avatar': sender_user.avatar
            } if sender_user else None,
            'receiver': {
                'id': receiver_user.id,
                'username': receiver_user.username,
                'nickname': receiver_user.nickname,
                'avatar': receiver_user.avatar
            } if receiver_user else None
        } 