import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { canManagePost, canManageComment } from '../utils/permissions';
import { 
  getPost, 
  getPostComments, 
  likePost, 
  favoritePost,
  deletePost,
  setTopPost,
  setEssencePost,
  createComment,
  deleteComment,
  replyComment
} from '../api/posts';

const PostDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [replyTo, setReplyTo] = useState(null);
  const [replyContent, setReplyContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  useEffect(() => {  const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await getPost(id);
        console.log('获取到的帖子数据:', response);
        const postData = {
          ...response,
          isLiked: response.isLiked || false,
          like_count: response.like_count || 0
        };
        setPost(postData);
        const commentsResponse = await getPostComments(id);
        
        const comments = (commentsResponse && commentsResponse.comments) ? commentsResponse.comments : [];
        console.log('获取到的评论数据:', comments);
        setComments(comments);
        setLoading(false);
      } catch (err) {
        setError(err.message || '加载失败');
        setLoading(false);
      }
    };
    fetchPost();
  }, [id]);  
  const handleLike = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await likePost(id);
      setPost(prev => ({
        ...prev,
        isLiked: !prev.isLiked,
        like_count: response.is_liked ? prev.like_count + 1 : prev.like_count - 1
      }));
    } catch (err) {
      console.error('点赞失败:', err);
    }
  };
  const handleFavorite = async () => {
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const response = await favoritePost(id);
      setPost(prev => ({
        ...prev,
        isFavorited: !prev.isFavorited,
        favorite_count: response.is_favorited ? prev.favorite_count + 1 : prev.favorite_count - 1
      }));
    } catch (err) {
      console.error('收藏失败:', err);
    }
  };

  const handleShare = async () => {
    try {
      // 如果是移动设备，使用原生分享
      if (navigator.share) {
        await navigator.share({
          title: post.title,
          text: post.content.substring(0, 100) + '...',
          url: window.location.href
        });
      } else {
        // 复制链接到剪贴板
        await navigator.clipboard.writeText(window.location.href);
        alert('链接已复制到剪贴板');
      }
    } catch (err) {
      console.error('分享失败:', err);
    }
  };  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    if (!newComment.trim()) return;
      try {
      const response = await createComment(id, newComment);
      if (response.message === '评论成功') {
        setComments(prev => [...prev, response.comment]);
        setNewComment('');
        alert('评论发表成功！');
      }
    } catch (err) {
      console.error('评论失败:', err);
    }
  };

  const handleReplySubmit = async (commentId) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!replyContent.trim()) return;
    
    try {
      const response = await replyComment(commentId, replyContent);
      setComments(prev => prev.map(comment => 
        comment.id === commentId 
          ? { ...comment, replies: [...comment.replies, response.data] }
          : comment
      ));      setReplyContent('');
      setReplyTo(null);
      alert('回复成功！');
    } catch (err) {
      console.error('回复失败:', err);
    }
  };
  const handleDeletePost = async () => {
    if (!window.confirm('确定要删除这个帖子吗？')) return;
    try {
      await delete(`/api/posts/${post.id}`);
      navigate(`/forum/${post.forum.id}`);
    } catch (error) {
      console.error('删除失败:', error);
    }
  };
  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('确定要删除这条评论吗？')) return;
    try {      
      await delete(`/api/comments/${commentId}`);
      setComments(prev => prev.filter(c => c.id !== commentId));
      alert('评论删除成功！');
    } catch (error) {
      console.error('删除失败:', error);
    }
  };

  if (loading) return <div className="text-center py-5">加载中...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!post) return <div className="alert alert-info m-4">帖子不存在</div>;

  return (
    <div className="post-detail-page container py-4">
      <div className="row">
        <div className="col-lg-8">
          <div className="card mb-4">
            <div className="card-header">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <Link to={`/forum/${post.forum.id}`} className={`badge bg-${post.forum.color} text-decoration-none me-2`}>
                    {post.forum.name}
                  </Link>
                  <span className="text-muted small">发布于 {post.createdAt}</span>
                </div>
                {canManagePost(user, post, post.forum.id) && (
                  <div className="dropdown">
                    <button className="btn btn-outline-secondary btn-sm dropdown-toggle" type="button" data-bs-toggle="dropdown">
                      管理
                    </button>
                    <ul className="dropdown-menu dropdown-menu-end">
                      {/* <li><button className="dropdown-item" onClick={handleSetTop}>置顶</button></li>
                      <li><button className="dropdown-item" onClick={handleSetEssence}>设为精华</button></li> */}
                      <li><hr className="dropdown-divider" /></li>
                      <li><button className="dropdown-item text-danger" onClick={handleDeletePost}>删除</button></li>
                    </ul>
                  </div>
                )}
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
              
              <div className="post-actions d-flex gap-2">                <button 
                  className={`btn ${post.isLiked ? 'btn-primary' : 'btn-outline-primary'}`}
                  onClick={handleLike}
                  disabled={!user}
                >
                  <i className={`${post.isLiked ? 'fas' : 'far'} fa-thumbs-up me-1`}></i>
                  {post.like_count || 0}
                  {post.isLiked && <span className="ms-1">已点赞</span>}
                </button>
                <button 
                  className={`btn ${post.isFavorited ? 'btn-warning' : 'btn-outline-warning'}`}
                  onClick={handleFavorite}
                >
                  <i className={`${post.isFavorited ? 'fas' : 'far'} fa-star me-1`}></i>
                  {post.isFavorited ? '已收藏' : '收藏'}
                </button>                <button 
                  className="btn btn-outline-secondary"
                  onClick={handleShare}
                >
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
                      <img src={comment.author.avatar} alt={comment.author.username} className="rounded-circle me-3" width="40" height="40" />
                      <div className="flex-grow-1">
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <div>
                            <span className="fw-bold">{comment.author.username}</span>
                            <small className="text-muted ms-2">{comment.createdAt}</small>
                          </div>
                          <div>
                            <button className="btn btn-sm btn-outline-primary me-1">
                              <i className="far fa-thumbs-up me-1"></i>{comment.likes}
                            </button>                            <button 
                              className="btn btn-sm btn-outline-secondary me-1"
                              onClick={() => setReplyTo(comment.id)}
                            >
                              回复
                            </button> {user && ((user.id) === (comment.user_id) || (post.forum?.moderators?.includes(Number(user.id)))) && (
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleDeleteComment(comment.id)}
                              >
                                删除
                              </button>
                            )}
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