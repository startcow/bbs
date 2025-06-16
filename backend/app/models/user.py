from .base import Base, db
from passlib.hash import pbkdf2_sha256
from .follow import user_follows

class User(Base):
    __tablename__ = 'users'
    
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    nickname = db.Column(db.String(80))
    avatar = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    role = db.Column(db.String(20), default='user')
    
    # 关注关系
    following = db.relationship('User',
                               secondary=user_follows,
                               primaryjoin='User.id == user_follows.c.follower_id',
                               secondaryjoin='User.id == user_follows.c.followed_id',
                               backref=db.backref('followers', lazy='dynamic'),
                               lazy='dynamic')
    
    def follow(self, user):
        """关注用户"""
        if not self.is_following(user):
            self.following.append(user)
            return self
    
    def unfollow(self, user):
        """取消关注用户"""
        if self.is_following(user):
            self.following.remove(user)
            return self
    
    def is_following(self, user):
        """检查是否已关注某用户"""
        return self.following.filter(user_follows.c.followed_id == user.id).count() > 0
    
    def get_following_count(self):
        """获取关注数量"""
        return self.following.count()
    
    def get_followers_count(self):
        """获取粉丝数量"""
        return self.followers.count()
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
        
    @password.setter
    def password(self, password):
        self.password_hash = pbkdf2_sha256.hash(password)
        
    def verify_password(self, password):
        return pbkdf2_sha256.verify(password, self.password_hash)
        
    def to_dict(self, current_user_id=None):
        data = {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'nickname': self.nickname,
            'avatar': self.avatar,
            'role': self.role,
            'following_count': self.get_following_count(),
            'followers_count': self.get_followers_count(),
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
        # 如果提供了当前用户ID，添加是否已关注的信息
        if current_user_id and current_user_id != self.id:
            from app.models.user import User
            current_user = User.query.get(current_user_id)
            if current_user:
                data['is_following'] = current_user.is_following(self)
        
        return data
        
    @classmethod
    def create_test_users(cls):
        """创建测试用户"""
        test_users = [
            {
                'username': 'admin',
                'email': 'admin@example.com',
                'password': '123456',
                'nickname': '系统管理员',
                'role': 'admin'
            },
            {
                'username': 'moderator',
                'email': 'mod@example.com',
                'password': '123456',
                'nickname': '版主小王',
                'role': 'moderator'
            },
            {
                'username': 'user1',
                'email': 'user1@example.com',
                'password': '123456',
                'nickname': '热心同学',
                'role': 'user'
            }
        ]
        
        for user_data in test_users:
            if not cls.query.filter_by(username=user_data['username']).first():
                user = cls(
                    username=user_data['username'],
                    email=user_data['email'],
                    nickname=user_data['nickname'],
                    role=user_data['role']
                )
                user.password = user_data['password']
                user.save()