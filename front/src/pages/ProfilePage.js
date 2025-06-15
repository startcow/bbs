import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Tab, Spinner, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { getUserPosts, getUserFavorites, getUserComments } from '../api/posts';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  const [searchParams] = useSearchParams();
  const [myPosts, setMyPosts] = useState([]);
  const [myFavorites, setMyFavorites] = useState([]);
  const [myComments, setMyComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('posts');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  // 根据URL参数设置活动标签页
  useEffect(() => {
    const tabParam = searchParams.get('tab');
    if (tabParam && ['posts', 'favorites', 'comments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [searchParams]);
  
  // 获取用户帖子
  const fetchUserPosts = async () => {
    console.log('fetchUserPosts 被调用');
    console.log('当前用户信息:', user);
    
    if (!user?.id) {
      console.log('用户未登录或用户ID不存在');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('正在调用 getUserPosts API, 用户ID:', user.id);
      const response = await getUserPosts(user.id, { page, per_page: 10 });
      console.log('API响应:', response); // 添加调试日志
      setMyPosts(response.posts || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('获取帖子失败');
      console.error('获取用户帖子失败:', err);
      console.error('错误详情:', err.response); // 添加错误详情日志
    } finally {
      setLoading(false);
    }
  };
  
  // 获取用户收藏
  const fetchUserFavorites = async () => {
    console.log('fetchUserFavorites 被调用');
    console.log('当前用户信息:', user);
    
    if (!user?.id) {
      console.log('用户未登录或用户ID不存在');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('正在调用 getUserFavorites API, 用户ID:', user.id);
      const response = await getUserFavorites(user.id, { page, per_page: 10 });
      console.log('收藏API响应:', response);
      setMyFavorites(response.posts || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('获取收藏失败');
      console.error('获取用户收藏失败:', err);
      console.error('错误详情:', err.response);
    } finally {
      setLoading(false);
    }
  };
  
  // 获取用户评论
  const fetchUserComments = async (page = 1) => {
    if (!user?.id) {
      console.log('用户未登录或用户ID不存在');
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      console.log('正在调用 getUserComments API, 用户ID:', user.id);
      const response = await getUserComments(user.id, { page, per_page: 10 });
      console.log('评论API响应:', response);
      setMyComments(response.comments || []);
      setTotalPages(response.pages || 1);
    } catch (err) {
      setError('获取评论失败');
      console.error('获取用户评论失败:', err);
      console.error('错误详情:', err.response);
    } finally {
      setLoading(false);
    }
  };
  
  // 当activeTab变化时获取对应数据
  useEffect(() => {
    console.log('useEffect 被触发, activeTab:', activeTab);
    if (activeTab === 'posts') {
      console.log('activeTab 是 posts，准备调用 fetchUserPosts');
      fetchUserPosts();
    } else if (activeTab === 'favorites') {
      console.log('activeTab 是 favorites，准备调用 fetchUserFavorites');
      fetchUserFavorites();
    } else if (activeTab === 'comments') {
      console.log('activeTab 是 comments，准备调用 fetchUserComments');
      fetchUserComments();
    }
  }, [user?.id, activeTab, page]);
  
  const getRoleBadge = (role) => {
    switch(role) {
      case 'admin':
        return <span className="badge bg-danger">系统管理员</span>;
      case 'moderator':
        return <span className="badge bg-primary">版主</span>;
      default:
        return <span className="badge bg-secondary">普通用户</span>;
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-banner">
        <Container className="position-relative">
          <div className="text-center text-white">
            <img
              src={user?.avatar}
              alt="用户头像"
              className="profile-avatar rounded-circle mb-4"
              onError={(e) => e.target.src = '/avatar-default.jpg'}
            />
            <h2 className="mb-2">
              {user?.username}
              <div className="mt-2">
                {getRoleBadge(user?.role)}
                {user?.badges?.map(badge => (
                  <span key={badge.id} className={`badge bg-${badge.color} ms-2`}>
                    {badge.name}
                  </span>
                ))}
              </div>
            </h2>
            <p className="mb-4 text-white-50">{user?.bio || '这个人很懒，什么都没写~'}</p>
            <Link to="/settings" className="btn btn-light edit-profile-btn">
              编辑资料
            </Link>
          </div>
        </Container>
      </div>

      <Container className="py-4">
        <Row className="g-4">
          <Col lg={4}>
            <Card className="profile-card mb-4 animate-fade-in">
              <Card.Header className="bg-white">
                <h5 className="mb-0">个人统计</h5>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col>
                    <div className="stats-item">
                      <div className="h3 mb-2">{myPosts.length}</div>
                      <div className="text-muted">发帖</div>
                    </div>
                  </Col>
                  <Col>
                    <div className="stats-item">
                      <div className="h3 mb-2">456</div>
                      <div className="text-muted">关注</div>
                    </div>
                  </Col>
                  <Col>
                    <div className="stats-item">
                      <div className="h3 mb-2">789</div>
                      <div className="text-muted">粉丝</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="profile-card animate-fade-in">
              <Card.Header className="bg-white">
                <h5 className="mb-0">个人标签</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex flex-wrap gap-2">
                  <span className="badge bg-primary">计算机科学</span>
                  <span className="badge bg-success">篮球</span>
                  <span className="badge bg-info">摄影</span>
                  <span className="badge bg-warning">旅行</span>
                  <span className="badge bg-danger">美食</span>
                </div>
              </Card.Body>
            </Card>

            <Card className="profile-card mb-4 animate-fade-in">
              <Card.Header className="bg-white">
                <h5 className="mb-0">角色与权限</h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="text-muted mb-2">用户角色</h6>
                  {getRoleBadge(user?.role)}
                </div>
                
                {user?.role === 'moderator' && (
                  <div className="mb-3">
                    <h6 className="text-muted mb-2">管理的板块</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {user.managedForums?.map(forumId => (
                        <Link 
                          key={forumId} 
                          to={`/forum/${forumId}`}
                          className="badge bg-light text-primary text-decoration-none"
                        >
                          板块 {forumId}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}

                {user?.permissions && (
                  <div>
                    <h6 className="text-muted mb-2">权限列表</h6>
                    <div className="d-flex flex-wrap gap-2">
                      {user.permissions.map((permission, index) => (
                        <span key={index} className="badge bg-light text-dark">
                          {permission}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col lg={8}>
            <Card className="profile-card animate-fade-in">
              <Tab.Container activeKey={activeTab} onSelect={setActiveTab}>
                <Card.Header className="bg-white p-0">
                  <Nav variant="tabs" className="px-3 pt-2">
                    <Nav.Item>
                      <Nav.Link eventKey="posts">我的帖子</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="favorites">我的收藏</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="comments">我的评论</Nav.Link>
                    </Nav.Item>
                  </Nav>
                </Card.Header>
                <Card.Body>
                  <Tab.Content>
                    <Tab.Pane eventKey="posts">
                    {loading && (
                      <div className="text-center py-4">
                        <Spinner animation="border" role="status">
                          <span className="visually-hidden">加载中...</span>
                        </Spinner>
                      </div>
                    )}
                    
                    {error && (
                      <Alert variant="danger" className="text-center">
                        {error}
                      </Alert>
                    )}
                    
                    {!loading && !error && myPosts.length === 0 && (
                      <p className="text-muted text-center py-5">暂无帖子记录</p>
                    )}
                    
                    {!loading && !error && myPosts.length > 0 && myPosts.map((post, index) => (
                      <Card key={post.id} className="post-card mb-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-primary">{post.forum?.name || '未知板块'}</span>
                            <small className="text-muted">{new Date(post.created_at).toLocaleDateString()}</small>
                          </div>
                          <h5 className="card-title">
                            <Link to={`/post/${post.id}`} className="text-decoration-none">
                              {post.title}
                            </Link>
                          </h5>
                          <p className="card-text text-muted">
                            {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                          </p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <i className="far fa-thumbs-up me-1"></i>{post.like_count || 0}
                            </small>
                            <small className="text-muted">
                              <i className="far fa-comment me-1"></i>{post.comment_count || 0}
                            </small>
                            <small className="text-muted">
                              <i className="far fa-eye me-1"></i>{post.view_count || 0}
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                    </Tab.Pane>
                    <Tab.Pane eventKey="favorites">
                      {loading && (
                        <div className="text-center py-4">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">加载中...</span>
                          </Spinner>
                        </div>
                      )}
                      
                      {error && (
                        <Alert variant="danger" className="text-center">
                          {error}
                        </Alert>
                      )}
                      
                      {!loading && !error && myFavorites.length === 0 && (
                        <p className="text-muted text-center py-5">暂无收藏记录</p>
                      )}
                      
                      {!loading && !error && myFavorites.length > 0 && myFavorites.map((post, index) => (
                        <Card key={post.id} className="post-card mb-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="badge bg-primary">{post.forum?.name || '未知板块'}</span>
                              <small className="text-muted">{new Date(post.created_at).toLocaleDateString()}</small>
                            </div>
                            <h5 className="card-title">
                              <Link to={`/post/${post.id}`} className="text-decoration-none">
                                {post.title}
                              </Link>
                            </h5>
                            <p className="card-text text-muted">
                              {post.content.length > 100 ? post.content.substring(0, 100) + '...' : post.content}
                            </p>
                            <div className="d-flex gap-3">
                              <small className="text-muted">
                                <i className="far fa-thumbs-up me-1"></i>{post.like_count || 0}
                              </small>
                              <small className="text-muted">
                                <i className="far fa-comment me-1"></i>{post.comment_count || 0}
                              </small>
                              <small className="text-muted">
                                <i className="far fa-eye me-1"></i>{post.view_count || 0}
                              </small>
                            </div>
                          </Card.Body>
                        </Card>
                      ))}
                    </Tab.Pane>
                    <Tab.Pane eventKey="comments">
                      {loading && (
                        <div className="text-center py-4">
                          <Spinner animation="border" role="status">
                            <span className="visually-hidden">加载中...</span>
                          </Spinner>
                        </div>
                      )}
                      
                      {error && (
                        <Alert variant="danger" className="text-center">
                          {error}
                        </Alert>
                      )}
                      
                      {!loading && !error && myComments.length === 0 && (
                        <p className="text-muted text-center py-5">暂无评论记录</p>
                      )}
                      
                      {!loading && !error && myComments.length > 0 && myComments.map((comment, index) => (
                        <Card key={comment.id} className="post-card mb-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                              <span className="badge bg-success">评论</span>
                              <small className="text-muted">{new Date(comment.created_at).toLocaleString()}</small>
                            </div>
                            <div className="mb-2">
                              <small className="text-muted">评论于帖子：</small>
                              <Link to={`/post/${comment.post_id}`} className="text-decoration-none ms-1">
                                {comment.post?.title || '未知帖子'}
                              </Link>
                            </div>
                            <p className="card-text">
                              {comment.content}
                            </p>
                          </Card.Body>
                        </Card>
                      ))}
                    </Tab.Pane>
                  </Tab.Content>
                </Card.Body>
              </Tab.Container>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;