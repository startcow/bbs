-- 添加测试用户
INSERT INTO users (username, email, password_hash, nickname, role) VALUES
('admin', 'admin@example.com', 'pbkdf2:sha256:123456', '系统管理员', 'admin'),
('moderator', 'mod@example.com', 'pbkdf2:sha256:123456', '版主小王', 'moderator'),
('user1', 'user1@example.com', 'pbkdf2:sha256:123456', '热心同学', 'user');

-- 论坛初始数据
INSERT INTO forums (name, description, icon, post_count) VALUES 
('课程交流', '分享学习资料，讨论课程问题', 'fa-book', 0),
('失物招领', '丢失物品发布，拾到物品归还', 'fa-search', 0),
('树洞', '匿名分享心情，倾诉烦恼', 'fa-comments', 0),
('表白墙', '勇敢表达爱意，传递美好情感', 'fa-heart', 0),
('组队', '寻找队友，组建团队', 'fa-users', 0),
('校园活动', '校园活动发布与讨论', 'fa-calendar', 0),
('学术科研', '学术讨论，科研交流', 'fa-flask', 0),
('日常生活', '分享校园生活点滴', 'fa-coffee', 0);

-- 设置版主
UPDATE forums SET moderator_id = 2 WHERE name IN ('课程交流', '失物招领');

-- 添加测试帖子
INSERT INTO posts (title, content, user_id, forum_id, view_count, like_count, comment_count) VALUES
('关于期末考试安排的通知', '各位同学：\n期末考试将于下周开始...', 1, 1, 100, 20, 5),
('寻找失物：图书馆丢失笔记本', '今天下午在图书馆三楼自习室丢失一个笔记本...', 3, 2, 50, 10, 3),
('校园生活趣事分享', '今天在食堂遇到一件有趣的事...', 3, 8, 200, 30, 8);

-- 添加测试评论
INSERT INTO comments (content, user_id, post_id, like_count) VALUES
('感谢通知！', 3, 1, 5),
('已帮你留意，如果看到会联系你', 2, 2, 3),
('哈哈确实很有趣', 1, 3, 8);