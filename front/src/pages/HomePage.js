import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, ListGroup, NavDropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import '../styles/HomePage.css'; 

const hotPosts = [
  { id: 1, title: "期末复习资料分享", author: "学霸一号", forum: "课程交流", comments: 42, likes: 156, time: "2小时前" },
  { id: 2, title: "校园歌手大赛报名开始啦", author: "活动组织者", forum: "校园活动", comments: 28, likes: 95, time: "4小时前" },
  { id: 3, title: "寻找一起参加数学建模比赛的队友", author: "数模爱好者", forum: "组队", comments: 15, likes: 37, time: "昨天" },
  { id: 4, title: "食堂新菜品测评", author: "美食达人", forum: "日常生活", comments: 56, likes: 128, time: "昨天" },
  { id: 5, title: "丢失学生卡，急寻", author: "粗心同学", forum: "失物招领", comments: 8, likes: 20, time: "2天前" },
];

const forums = [
  { id: 1, name: "课程交流", icon: "fa-book", posts: 1245, color: "primary" },
  { id: 2, name: "失物招领", icon: "fa-search", posts: 856, color: "success" },
  { id: 3, name: "树洞", icon: "fa-comments", posts: 2367, color: "danger" },
  { id: 4, name: "表白墙", icon: "fa-heart", posts: 1589, color: "warning" },
  { id: 5, name: "组队", icon: "fa-users", posts: 743, color: "info" },
  { id: 6, name: "校园活动", icon: "fa-calendar", posts: 932, color: "secondary" },
];

const announcements = [
  { id: 1, title: "关于校园网络升级的通知", date: "2023-06-15" },
  { id: 2, title: "期末考试安排已公布", date: "2023-06-10" },
  { id: 3, title: "暑期社会实践活动报名", date: "2023-06-05" },
];

const HomePage = () => {
  const { user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  return (
    <div className="homepage">
      {/* 顶部横幅 */}
      <section className="hero-section py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={6}>
              <h1 className="display-4 fw-bold text-white mb-4">
                欢迎来到果壳校园
              </h1>
              <p className="lead text-white-50 mb-4">
                连接校园，分享生活，交流学习，这里是属于我们的数字校园社区
              </p>
              <div className="d-flex gap-3">
                {!user ? (
                  <>
                    <Button as={Link} to="/register" variant="light" size="lg">
                      立即加入
                    </Button>
                    <Button as={Link} to="/forums" variant="outline-light" size="lg">
                      浏览板块
                    </Button>
                  </>
                ) : (
                  <Button as={Link} to="/forums" variant="light" size="lg">
                    发布内容
                  </Button>
                )}
              </div>
            </Col>
            <Col lg={6}>
              <div 
                style={{
                  width: '100%',
                  height: '300px',
                  background: 'linear-gradient(45deg, #ffffff20, #ffffff40)',
                  borderRadius: '15px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255,255,255,0.3)'
                }}
                className="shadow"
              >
                <div className="text-center text-white">
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎓</div>
                  <h3>果壳校园</h3>
                  <p>连接每一个校园故事</p>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
      
      {/* 主要内容区域 */}
      <Container className="my-5">
        <Row>
          {/* 左侧内容 */}
          <Col lg={8}>
            {/* 热门帖子 */}
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">🔥 热门帖子</h2>
                <Button as={Link} to="/posts/hot" variant="outline-primary" size="sm">
                  查看更多
                </Button>
              </div>
              <Row>
                {hotPosts.map(post => (
                  <Col key={post.id} md={6} className="mb-3">
                    <Card className="h-100 shadow-sm border-0" style={{ transition: 'all 0.3s ease' }}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-2">
                          <Badge bg="secondary">{post.forum}</Badge>
                          <small className="text-muted">{post.time}</small>
                        </div>
                        <Card.Title as="h5">
                          <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                            {post.title}
                          </Link>
                        </Card.Title>
                        <div className="d-flex justify-content-between align-items-center">
                          <div className="d-flex align-items-center">
                            <div 
                              style={{
                                width: '24px',
                                height: '24px',
                                backgroundColor: '#6c757d',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginRight: '8px'
                              }}
                            >
                              <span style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                                {post.author.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <small className="text-muted">{post.author}</small>
                          </div>
                          <div className="d-flex gap-3">
                            <small className="text-muted">
                              👍 {post.likes}
                            </small>
                            <small className="text-muted">
                              💬 {post.comments}
                            </small>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </section>
            
            {/* 最新动态 */}
            <section className="mb-5">
              <h2 className="h3 mb-4">📢 最新动态</h2>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="latest-posts">
                    {/* 这里可以放最新帖子，结构类似热门帖子 */}
                    <p className="text-center py-3">加载最新动态...</p>
                  </div>
                </Card.Body>
              </Card>
            </section>
          </Col>
          
          {/* 右侧边栏 */}
          <Col lg={4}>
            {/* 热门板块 */}
            <section className="mb-4">
              <h3 className="h4 mb-3">🏆 热门板块</h3>
              <div>
                {forums.map(forum => (
                  <Card key={forum.id} className="mb-3 border-0 shadow-sm forum-card">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <div className="forum-icon me-3" style={{ fontSize: '2rem' }}>
                          <i className={`fas ${forum.icon} text-${forum.color}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <Card.Title as="h6" className="mb-1">
                            <Link to={`/forum/${forum.id}`} className="text-decoration-none text-dark">
                              {forum.name}
                            </Link>
                          </Card.Title>
                          <div className="mt-2">
                            <small className="text-muted">
                              {forum.posts} 篇帖子
                            </small>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>
            
            {/* 公告栏 */}
            <section className="mb-4">
              <h3 className="h4 mb-3">📋 公告栏</h3>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <ListGroup variant="flush">
                    {announcements.map(announcement => (
                      <ListGroup.Item key={announcement.id} className="border-0 px-0">
                        <Link to={`/announcement/${announcement.id}`} className="text-decoration-none">
                          <small className="text-primary fw-medium">{announcement.title}</small>
                        </Link>
                        <br />
                        <small className="text-muted">{announcement.date}</small>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>
            </section>
            
            {/* 近期活动 */}
            <section>
              <h3 className="h4 mb-3">🎉 近期活动</h3>
              <Card className="border-0 shadow-sm">
                <Card.Body>
                  <div className="upcoming-events">
                    <div className="event-item p-2 border-bottom">
                      <div className="event-date badge bg-primary me-2">6月20日</div>
                      <span>校园歌手大赛初赛</span>
                    </div>
                    <div className="event-item p-2 border-bottom">
                      <div className="event-date badge bg-success me-2">6月25日</div>
                      <span>程序设计竞赛</span>
                    </div>
                    <div className="event-item p-2">
                      <div className="event-date badge bg-info me-2">7月1日</div>
                      <span>毕业典礼</span>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </section>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;