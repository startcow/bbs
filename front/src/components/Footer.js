import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';
import '../styles/Footer.css'; // 确保你有这个CSS文件来定义样式

const Footer = () => {
  return (
    <footer className="footer bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col md={3}>
            <h5 className="text-white mb-3">关于我们</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">关于果壳校园</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">联系我们</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">加入我们</a></li>
              <li className="mb-2"><a href="#" className="text-light text-decoration-none">隐私政策</a></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5 className="text-white mb-3">快速链接</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/" className="text-light text-decoration-none">首页</Link></li>
              <li className="mb-2"><Link to="/forums" className="text-light text-decoration-none">板块</Link></li>
              <li className="mb-2"><Link to="/search" className="text-light text-decoration-none">搜索</Link></li>
              <li className="mb-2"><Link to="/help" className="text-light text-decoration-none">帮助中心</Link></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5 className="text-white mb-3">热门板块</h5>
            <ul className="list-unstyled">
              <li className="mb-2"><Link to="/forum/1" className="text-light text-decoration-none">学习交流</Link></li>
              <li className="mb-2"><Link to="/forum/2" className="text-light text-decoration-none">生活分享</Link></li>
              <li className="mb-2"><Link to="/forum/3" className="text-light text-decoration-none">社团活动</Link></li>
              <li className="mb-2"><Link to="/forum/4" className="text-light text-decoration-none">求职招聘</Link></li>
            </ul>
          </Col>
          
          <Col md={3}>
            <h5 className="text-white mb-3">关注我们</h5>
            <div className="social-links mb-3">
              <a href="#" className="text-light me-3" style={{ fontSize: '1.5rem' }}>📱</a>
              <a href="#" className="text-light me-3" style={{ fontSize: '1.5rem' }}>💬</a>
              <a href="#" className="text-light me-3" style={{ fontSize: '1.5rem' }}>📧</a>
              <a href="#" className="text-light" style={{ fontSize: '1.5rem' }}>🐙</a>
            </div>
            <div>
              <p className="text-muted small mb-0">校园BBS - 连接每一个校园故事</p>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4 border-secondary" />
        
        <Row className="align-items-center">
          <Col md={6} className="text-md-end">
            <small className="text-muted">
              <a href="#" className="text-light text-decoration-none me-3">服务条款</a>
              <a href="#" className="text-light text-decoration-none me-3">隐私政策</a>
              <a href="#" className="text-light text-decoration-none">意见反馈</a>
            </small>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;