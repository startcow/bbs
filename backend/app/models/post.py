from datetime import datetime
from app import db
from .user import User

# 点赞中间表
post_likes = db.Table('post_likes',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id')),
    db.Column('created_at', db.DateTime, default=datetime.utcnow)
)

# 收藏中间表
post_favorites = db.Table('post_favorites',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id')),
    db.Column('post_id', db.Integer, db.ForeignKey('posts.id')),
    db.Column('created_at', db.DateTime, default=datetime.utcnow)
)

# 通用点赞表
likes = db.Table('likes',
    db.Column('id', db.Integer, primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), nullable=False),
    db.Column('target_type', db.Enum('post', 'comment'), nullable=False),
    db.Column('target_id', db.Integer, nullable=False),
    db.Column('created_at', db.DateTime, default=datetime.utcnow),
    db.UniqueConstraint('user_id', 'target_type', 'target_id', name='unique_like')
)

class Post(db.Model):
    __tablename__ = 'posts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    content = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    forum_id = db.Column(db.Integer, db.ForeignKey('forums.id'), nullable=False)
    view_count = db.Column(db.Integer, default=0)
    like_count = db.Column(db.Integer, default=0)
    comment_count = db.Column(db.Integer, default=0)
    status = db.Column(db.Enum('normal', 'pinned', 'hidden'), default='normal')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
      # 关联
    author = db.relationship('User', backref='posts')
    forum = db.relationship('Forum', backref='posts')
    comments = db.relationship('Comment', backref='post', lazy='dynamic', cascade='all, delete-orphan')
    # 点赞关系
    likes = db.relationship('User', secondary='post_likes',
                          backref=db.backref('liked_posts', lazy='dynamic'))
    
    # 收藏关系
    favorites = db.relationship('User', secondary='post_favorites',
                              backref=db.backref('favorited_posts', lazy='dynamic'))
    def to_dict(self, current_user_id=None):
        data = {
            'id': self.id,
            'title': self.title,
            'content': self.content,
            'author': self.author.to_dict(),
            'forum': self.forum.to_dict(),
            'view_count': self.view_count,
            'like_count': self.like_count,
            'comment_count': self.comment_count,
            'status': self.status,
            'created_at': self.created_at.strftime('%Y-%m-%d %H:%M:%S')
        }
        
        if current_user_id:
            data.update({
                'is_liked': self.is_liked_by(current_user_id),
                'is_favorited': self.is_favorited_by(current_user_id)
            })
            
        return data
    # 点赞方法
    def like(self, user_id):
        if not self.is_liked_by(user_id):
            user = User.query.get(user_id)
            self.likes.append(user)
            db.session.commit()
    
    def unlike(self, user_id):
        user = User.query.get(user_id)
        if user in self.likes:
            self.likes.remove(user)
            db.session.commit()
    
    def is_liked_by(self, user_id):
        return User.query.get(user_id) in self.likes
    
    # 收藏方法
    def favorite(self, user_id):
        if not self.is_favorited_by(user_id):
            user = User.query.get(user_id)
            self.favorites.append(user)
            db.session.commit()
    
    def unfavorite(self, user_id):
        user = User.query.get(user_id)
        if user in self.favorites:
            self.favorites.remove(user)
            db.session.commit()
    
    def is_favorited_by(self, user_id):
        return User.query.get(user_id) in self.favorites