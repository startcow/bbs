import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

// 模拟帖子数据
const mockPost = {
  id: 1,
  title: "期末复习资料分享",
  content: `大家好！期末考试快到了，我整理了一些复习资料想和大家分享。

包含以下内容：
1. 高等数学重点知识点总结
2. 线性代数习题集
3. 概率论与数理统计复习笔记
4. 历年真题及答案解析

希望对大家的复习有帮助！有需要的同学可以私信我，或者在评论区留言。

祝大家期末考试顺利！🎉`,
  author: {
    id: 1,
    username: "学霸一号",
    avatar: "/avatar1.jpg",
    level: "资深会员"
  },
  forum: {
    id: 1,
    name: "课程交流",
    color: "primary"
  },
  createdAt: "2023-06-15 14:30",
  views: 1256,
  likes: 156,
  isLiked: false,
  isFavorited: false,
  tags: ["复习资料", "期末考试", "数学"]
};

// 模拟评论数据
const mockComments = [
  {
    id: 1,
    content: "太感谢了！正好需要这些资料",
    author: {
      id: 2,
      username: "努力学习中",
      avatar: "/avatar2.jpg"
    },
    createdAt: "2023-06-15 15:20",
    likes: 12,
    isLiked: false,
    replies: [
      {
        id: 11,
        content: "我也需要，楼主人真好！",
        author: {
          id: 3,
          username: "小白同学",
          avatar: "/avatar3.jpg"
        },
        createdAt: "2023-06-15 16:10",
        likes: 3,
        isLiked: false
      }
    ]
  },
  {
    id: 2,
    content: "请问有英语复习资料吗？",
    author: {
      id: 4,
      username: "英语苦手",
      avatar: "/avatar4.jpg"
    },
    createdAt: "2023-06-15 16:45",
    likes: 8,
    isLiked: false,
    replies: []
  }
];

const PostDetailPage = () => {
  const { id } = useParams();
  const [post, setPost] = useState(mockPost);
  const [comments, setComments] = useState(mockComments);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');

  const handleLike = () => {
    setPost(prev => ({
      ...prev,
      isLiked: !prev.isLiked,
      likes: prev.isLiked ? prev.likes - 1 : prev.likes + 1
    }));
  };

  const handleFavorite = () => {
    setPost(prev => ({
      ...prev,
      isFavorited: !prev.isFavorited
    }));
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      const comment = {
        id: Date.now(),
        content: newComment,
        author: {
          id: 999,
          username: "当前用户",
          avatar: "/avatar-default.jpg"
        },
        createdAt: new Date().toLocaleString(),
        likes: 0,
        isLiked: false,
        replies: []
      };
      setComments(prev => [...prev, comment]);
      setNewComment('');
    }
  };

  const handleReplySubmit = (commentId) => {
    if (replyContent.trim()) {
      const reply = {
        id: Date.now(),
        content: replyContent,
        author: {
          id: 999,
          username: "当前用户",
          avatar: "/avatar-default.jpg"
        },
        createdAt: new Date().toLocaleString(),
        likes: 0,
        isLiked: false
      };
      
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, reply] }
          : comment
      ));
      setReplyContent('');
      setReplyTo(null);
    }
  };

  return (
    <div className="post-detail-page container py-4">
      <div className="row">
        <div className="col-lg-8">
          {/* 帖子内容 */}
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Link to={`/forum/${post.forum.id}`} className={`badge bg-${post.forum.color} text-decoration-none me-2`}>
                    {post.forum.name}
                  </Link>
                  <span className="text-muted small">发布于 {post.createdAt}</span>
                </div>
                <div>
                  <i className="fas fa-eye me-1"></i>
                  <span className="text-muted small">{post.views} 浏览</span>
                </div>
              </div>
            </div>
            
            <div className="card-body">
              <h2 className="card-title mb-3">{post.title}</h2>
              
              <div className="d-flex align-items-center mb-3">
                <img src={post.author.avatar} alt={post.author.username} className="rounded-circle me-2" width="40" height="40" onError={(e) => e.target.src = '/avatar-default.jpg'} />
                <div>
                  <div className="fw-bold">{post.author.username}</div>
                  <small className="text-muted">{post.author.level}</small>
                </div>
              </div>
              
              <div className="post-content mb-4" style={{whiteSpace: 'pre-line'}}>
                {post.content}
              </div>
              
              <div className="post-tags mb-3">
                {post.tags.map((tag, index) => (
                  <span key={index} className="badge bg-light text-dark me-1">#{tag}</span>
                ))}
              </div>
              
              <div className="post-actions d-flex gap-2">
                <button 
                  className={`btn ${post.isLiked ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={handleLike}
                >
                  <i className={`${post.isLiked ? 'fas' : 'far'} fa-thumbs-up me-1`}></i>
                  {post.likes}
                </button>
                <button 
                  className={`btn ${post.isFavorited ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={handleFavorite}
                >
                  <i className={`${post.isFavorited ? 'fas' : 'far'} fa-star me-1`}></i>
                  {post.isFavorited ? '已收藏' : '收藏'}
                </button>
                <button className="btn btn-outline-secondary">
                  <i className="fas fa-share me-1"></i>分享
                </button>
              </div>
            </div>
          </div>
          
          {/* 评论区 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">
                <i className="fas fa-comments me-2"></i>
                评论 ({comments.length})
              </h5>
            </div>
            
            <div className="card-body">
              {/* 发表评论 */}
              <form onSubmit={handleCommentSubmit} className="mb-4">
                <div className="mb-3">
                  <textarea
                    className="form-control"
                    rows="3"
                    placeholder="写下你的评论..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                  ></textarea>
                </div>
                <button type="submit" className="btn btn-primary">
                  <i className="fas fa-paper-plane me-1"></i>发表评论
                </button>
              </form>
              
              {/* 评论列表 */}
              <div className="comments-list">
                {comments.map(comment => (
                  <div key={comment.id} className="comment-item border-bottom pb-3 mb-3">
                    <div className="d-flex align-items-start">
                      <img src={comment.author.avatar} alt={comment.author.username} className="rounded-circle me-3" width="40" height="40" onError={(e) => e.target.src = '/avatar-default.jpg'} />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <span className="fw-bold">{comment.author.username}</span>
                            <small className="text-muted ms-2">{comment.createdAt}</small>
                          </div>
                          <div>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="far fa-thumbs-up me-1"></i>{comment.likes}
                            </button>
                            <button 
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setReplyTo(comment.id)}
                            >
                              回复
                            </button>
                          </div>
                        </div>
                        <p className="mb-2">{comment.content}</p>
                        
                        {/* 回复表单 */}
                        {replyTo === comment.id && (
                          <div className="reply-form mt-3">
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control"
                                placeholder="回复评论..."
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                              />
                              <button 
                                className="btn btn-primary"
                                onClick={() => handleReplySubmit(comment.id)}
                              >
                                回复
                              </button>
                              <button 
                                className="btn btn-outline-secondary"
                                onClick={() => setReplyTo(null)}
                              >
                                取消
                              </button>
                            </div>
                          </div>
                        )}
                        
                        {/* 回复列表 */}
                        {comment.replies.length > 0 && (
                          <div className="replies mt-3">
                            {comment.replies.map(reply => (
                              <div key={reply.id} className="reply-item d-flex align-items-start mt-2 ps-3 border-start">
                                <img src={reply.author.avatar} alt={reply.author.username} className="rounded-circle me-2" width="30" height="30" onError={(e) => e.target.src = '/avatar-default.jpg'} />
                                <div className="flex-grow-1">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <span className="fw-bold small">{reply.author.username}</span>
                                      <small className="text-muted ms-2">{reply.createdAt}</small>
                                    </div>
                                    <button className="btn btn-sm btn-outline-primary">
                                      <i className="far fa-thumbs-up me-1"></i>{reply.likes}
                                    </button>
                                  </div>
                                  <p className="small mb-0">{reply.content}</p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* 右侧边栏 */}
        <div className="col-lg-4">
          {/* 作者信息 */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">作者信息</h6>
            </div>
            <div className="card-body text-center">
              <img src={post.author.avatar} alt={post.author.username} className="rounded-circle mb-3" width="80" height="80" onError={(e) => e.target.src = '/avatar-default.jpg'} />
              <h6>{post.author.username}</h6>
              <p className="text-muted small">{post.author.level}</p>
              <div className="d-grid gap-2">
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-plus me-1"></i>关注
                </button>
                <button className="btn btn-outline-secondary btn-sm">
                  <i className="fas fa-envelope me-1"></i>私信
                </button>
              </div>
            </div>
          </div>
          
          {/* 相关帖子 */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">相关帖子</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/post/2" className="list-group-item list-group-item-action">
                  <h6 className="mb-1">数学建模竞赛组队</h6>
                  <small className="text-muted">课程交流 • 2天前</small>
                </Link>
                <Link to="/post/3" className="list-group-item list-group-item-action">
                  <h6 className="mb-1">线性代数学习心得</h6>
                  <small className="text-muted">课程交流 • 3天前</small>
                </Link>
                <Link to="/post/4" className="list-group-item list-group-item-action">
                  <h6 className="mb-1">期末考试时间安排</h6>
                  <small className="text-muted">课程交流 • 1周前</small>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostDetailPage;