import os
import sys

# 添加项目根目录到Python路径
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.user import User
from app.models.forum import Forum
from app.models.post import Post
from app.models.comment import Comment

def init_test_data():
    app = create_app()
    with app.app_context():
        # 创建测试用户
        User.create_test_users()
        db.session.commit()
        
        # 创建论坛
        forums = [
            Forum(name='课程交流', description='分享学习资料，讨论课程问题', icon='fa-book'),
            Forum(name='失物招领', description='丢失物品发布，拾到物品归还', icon='fa-search'),
            Forum(name='树洞', description='匿名分享心情，倾诉烦恼', icon='fa-comments'),
            Forum(name='表白墙', description='勇敢表达爱意，传递美好情感', icon='fa-heart'),
            Forum(name='组队', description='寻找队友，组建团队', icon='fa-users'),
            Forum(name='校园活动', description='校园活动发布与讨论', icon='fa-calendar'),
            Forum(name='学术科研', description='学术讨论，科研交流', icon='fa-flask'),
            Forum(name='日常生活', description='分享校园生活点滴', icon='fa-coffee')
        ]
        
        for forum in forums:
            db.session.add(forum)
        db.session.commit()
        
        # 设置版主
        moderator = User.query.filter_by(username='moderator').first()
        if moderator:
            Forum.query.filter_by(name='课程交流').first().moderator_id = moderator.id
            Forum.query.filter_by(name='失物招领').first().moderator_id = moderator.id
            db.session.commit()
        
        # 创建测试帖子
        admin = User.query.filter_by(username='admin').first()
        user1 = User.query.filter_by(username='user1').first()
        
        if admin and user1:
            posts = [
                Post(
                    title='关于期末考试安排的通知',
                    content='各位同学：\n期末考试将于下周开始...',
                    user_id=admin.id,
                    forum_id=1,
                    view_count=100,
                    like_count=20,
                    comment_count=5
                ),
                Post(
                    title='寻找失物：图书馆丢失笔记本',
                    content='今天下午在图书馆三楼自习室丢失一个笔记本...',
                    user_id=user1.id,
                    forum_id=2,
                    view_count=50,
                    like_count=10,
                    comment_count=3
                ),
                Post(
                    title='校园生活趣事分享',
                    content='今天在食堂遇到一件有趣的事...',
                    user_id=user1.id,
                    forum_id=8,
                    view_count=200,
                    like_count=30,
                    comment_count=8
                )
            ]
            
            for post in posts:
                db.session.add(post)
            db.session.commit()
            
            # 获取已创建的帖子ID
            post1 = Post.query.filter_by(title='关于期末考试安排的通知').first()
            post2 = Post.query.filter_by(title='寻找失物：图书馆丢失笔记本').first()
            post3 = Post.query.filter_by(title='校园生活趣事分享').first()
            
            if post1 and post2 and post3:
                # 创建测试评论
                comments = [
                    Comment(
                        content='感谢通知！',
                        user_id=user1.id,
                        post_id=post1.id,
                        like_count=5
                    ),
                    Comment(
                        content='已帮你留意，如果看到会联系你',
                        user_id=moderator.id,
                        post_id=post2.id,
                        like_count=3
                    ),
                    Comment(
                        content='哈哈确实很有趣',
                        user_id=admin.id,
                        post_id=post3.id,
                        like_count=8
                    )
                ]
                
                for comment in comments:
                    db.session.add(comment)
                db.session.commit()

if __name__ == '__main__':
    init_test_data() 