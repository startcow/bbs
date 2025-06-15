from datetime import datetime
from app import db
from .user import User  # 导入 User 模型

class Comment(db.Model):
    __tablename__ = 'comments'
    
    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    post_id = db.Column(db.Integer, db.ForeignKey('posts.id'), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('comments.id'))
    like_count = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
      # 添加关联关系
    user = db.relationship('User', backref='comments')
    # 删除 post relationship，因为已经在 Post 模型中定义了
    replies = db.relationship('Comment', backref=db.backref('parent', remote_side=[id]))

    def to_dict(self, current_user_id=None):
        from app.models.post import likes
        
        data = {
            'id': self.id,
            'content': self.content,
            'user_id': self.user_id,
            'post_id': self.post_id,
            'parent_id': self.parent_id,
            'author': self.user.to_dict(),
            'replies': [reply.to_dict(current_user_id) for reply in self.replies],
            'likes': self.like_count,
            'createdAt': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        if current_user_id:
            # 检查当前用户是否点赞了这条评论
            from app import db
            like_record = db.session.query(likes).filter_by(
                user_id=current_user_id,
                target_type='comment',
                target_id=self.id
            ).first()
            data['isLiked'] = like_record is not None
        else:
            data['isLiked'] = False
            
        return data