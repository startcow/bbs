import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Button, ListGroup, NavDropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import '../styles/HomePage.css';
import { getLatestPosts } from '../api/posts';
import { getNotices } from '../api/spider';
import api from '../api'; // 导入 api 实例
import RecentActivity from '../components/RecentActivity';

const HomePage = () => {
  const { user } = useSelector(state => state.auth);
  const [notices, setNotices] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);

  // 添加状态来存储热门帖子和热门板块数据
  const [hotPosts, setHotPosts] = useState([]);
  const [popularForums, setPopularForums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [allForums, setAllForums] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const noticeResp = await getNotices();
        if (noticeResp && noticeResp.notices) {
          setNotices(noticeResp.notices.slice(0, 5));
        }
        // 获取热门帖子 (按点赞数排序)
        const postsResponse = await api.get('/posts?sort_by=popular&per_page=3'); // 使用 api.get
        setHotPosts(postsResponse.posts);

        // 获取热门板块 (按帖子数量排序)
        const forumsResponse = await api.get('/forums?sort_by=popular'); // 使用 api.get
        setPopularForums(forumsResponse.forums);

        // 获取最新帖子
        const latestPostsResponse = await api.get('/posts?sort_by=latest&per_page=5'); // 使用 api.get
        setLatestPosts(latestPostsResponse.posts);

        // 获取所有板块
        const allForumsResponse = await api.get('/forums'); // 使用 api.get
        setAllForums(allForumsResponse.forums);

      } catch (error) {
        console.error("获取首页数据失败:", error);
        setError("加载数据失败，请稍后再试。");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        // 这里的 getLatestPosts 已经使用了 api 实例，不需要修改
        const response = await getLatestPosts({ per_page: 10 });
        if (response.data && response.data.posts) {
          setLatestPosts(response.data.posts);
        }
      } catch (err) {
        console.error('获取最新帖子失败:', err);
      }
    };

    fetchLatestPosts();
  }, []);

  // 辅助函数：通过forum_id查找板块名字，优先用post.forum.name
  const getForumName = (post) => {
    if (post.forum && post.forum.name) return post.forum.name;
    const forum = allForums.find(f => String(f.id) === String(post.forum_id));
    return forum ? forum.name : `ID:${post.forum_id}`;
  };

  if (loading) {
    return <Container className="my-5 text-center"><p>加载中...</p></Container>;
  }

  if (error) {
    return <Container className="my-5 text-center text-danger"><p>{error}</p></Container>;
  }

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
              <div className="mb-4">
                <h2 className="h3 mb-0">🔥 热门帖子</h2>
              </div>

              <div>
                {hotPosts.map((post, index) => (
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
                        {post.content && post.content.length > 100 ? post.content.substring(0, 100) + '...' : (post.content || '暂无内容')}
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
              </div>
            </section>
            <section className="mb-5">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="h3 mb-0">📢 最新动态</h2>
                <Button as={Link} to="/posts" variant="outline-primary" size="sm">
                  查看更多
                </Button>
              </div>
              <div>
                {latestPosts.map((post, index) => (
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
                        {post.content && post.content.length > 100 ? post.content.substring(0, 100) + '...' : (post.content || '暂无内容')}
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
              </div>
            </section>
          </Col>

          {/* 右侧边栏 */}
          <Col lg={4}>
            {/* 热门板块 */}
            <section className="mb-4">
              <h3 className="h4 mb-3">🏆 热门板块</h3>
              <div>
                {popularForums.map(forum => (
                  <Card key={forum.id} className="mb-3 border-0 shadow-sm forum-card">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <div className="forum-icon me-3" style={{ fontSize: '2rem' }}>
                          <i className={`fas ${forum.icon || 'fa-folder'} text-${forum.color || 'primary'}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <Card.Title as="h6" className="mb-1">
                            <Link to={`/forum/${forum.id}`} className="text-decoration-none text-dark">
                              {forum.name}
                            </Link>
                          </Card.Title>
                          <div className="mt-2">
                            <small className="text-muted">
                              {forum.total_post_count} 篇帖子
                            </small>
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            </section>

            <section className="mb-4">
              <h3 className="h4 mb-3">📋 公告栏</h3>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {notices && notices.map((post, index) => (
                      <ListGroup.Item key={index} className="border-0 px-3 py-2">
                        <a
                          href={post.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-decoration-none text-dark"
                        >
                          <div className="small text-truncate">{post.title}</div>
                          <div className="smaller text-muted mt-1">
                            {post.author?.username}
                          </div>
                        </a>
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
                  <RecentActivity />
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