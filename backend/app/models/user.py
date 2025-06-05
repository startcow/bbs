from .base import Base, db
from passlib.hash import pbkdf2_sha256

class User(Base):
    __tablename__ = 'users'
    
    username = db.Column(db.String(80), unique=True, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(128))
    nickname = db.Column(db.String(80))
    avatar = db.Column(db.String(200))
    is_active = db.Column(db.Boolean, default=True)
    role = db.Column(db.String(20), default='user')
    
    @property
    def password(self):
        raise AttributeError('password is not a readable attribute')
        
    @password.setter
    def password(self, password):
        self.password_hash = pbkdf2_sha256.hash(password)
        
    def verify_password(self, password):
        return pbkdf2_sha256.verify(password, self.password_hash)
        
    def to_dict(self):
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'nickname': self.nickname,
            'avatar': self.avatar,
            'role': self.role,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat()
        }
        
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