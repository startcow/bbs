import React from 'react';
import { Container, Row, Col, Card, Nav, Tab } from 'react-bootstrap';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import '../styles/ProfilePage.css';

const ProfilePage = () => {
  const { user } = useSelector(state => state.auth);
  
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
                      <div className="h3 mb-2">123</div>
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
              <Card.Header className="bg-white p-0">
                <Nav variant="tabs" defaultActiveKey="posts" className="px-3 pt-2">
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
                    {[1, 2, 3].map(index => (
                      <Card key={index} className="post-card mb-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-2">
                            <span className="badge bg-primary">课程交流</span>
                            <small className="text-muted">2天前</small>
                          </div>
                          <h5 className="card-title">示例帖子标题 {index}</h5>
                          <p className="card-text text-muted">这是一个示例帖子内容的预览...</p>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              <i className="far fa-thumbs-up me-1"></i>25
                            </small>
                            <small className="text-muted">
                              <i className="far fa-comment me-1"></i>10
                            </small>
                            <small className="text-muted">
                              <i className="far fa-eye me-1"></i>100
                            </small>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </Tab.Pane>
                  <Tab.Pane eventKey="favorites">
                    <p className="text-muted text-center py-5">暂无收藏记录</p>
                  </Tab.Pane>
                  <Tab.Pane eventKey="comments">
                    <p className="text-muted text-center py-5">暂无评论记录</p>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default ProfilePage;