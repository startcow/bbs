from datetime import datetime
from app import db

class Forum(db.Model):
    __tablename__ = 'forums'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    icon = db.Column(db.String(200))
    moderator_id = db.Column(db.Integer, db.ForeignKey('users.id'))
    post_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # 关联
    moderator = db.relationship('User', backref='moderated_forums')
    
    def to_dict(self):
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'icon': self.icon,
            'post_count': self.post_count,
            'moderator': self.moderator.to_dict() if self.moderator else None,
            'moderators': [self.moderator.to_dict()] if self.moderator else [],
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }