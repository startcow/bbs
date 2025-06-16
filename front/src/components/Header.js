import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, NavDropdown } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import '../styles/Header.css';
import ChatWindow from './ChatWindow';
import storage from '../utils/storage';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showChat, setShowChat] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?keyword=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleLogout = () => {
    // 清理Redux状态
    dispatch(logout());
    // 清理本地存储
    storage.removeItem('token');
    storage.removeItem('user');
    storage.removeItem('rememberMe');
    storage.removeItem('savedUsername');
    navigate('/');
  };

  return (
    <>
      <Navbar bg="white" expand="lg" className="shadow-sm">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center">
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#0d6efd',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: '8px'
              }}
            >
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '16px' }}>BBS</span>
            </div>
            <span className="fw-bold text-primary">果壳校园</span>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link as={Link} to="/">首页</Nav.Link>
              <Nav.Link as={Link} to="/forums">板块</Nav.Link>
            </Nav>

            <Form className="d-flex me-3" onSubmit={handleSearch}>
              <Form.Control
                type="search"
                placeholder="搜索帖子、用户..."
                className="me-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button variant="outline-primary" type="submit">
                搜索
              </Button>
            </Form>

            <div className="d-flex align-items-center">
              {user && (
                <>
                  {/* 消息按钮 */}
                  <Button
                    className="chat-msg-btn me-2"
                    onClick={() => setShowChat(v => !v)}
                    title="消息"
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M4 6.5C4 5.12 5.12 4 6.5 4h11c1.38 0 2.5 1.12 2.5 2.5v7c0 1.38-1.12 2.5-2.5 2.5H7.92L5.2 19.13A.5.5 0 0 1 4.5 18.7V6.5Z" fill="#fff" />
                    </svg>
                  </Button>
                  <NavDropdown
                    title={
                      <div className="d-flex align-items-center">
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#28a745',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            marginRight: '8px'
                          }}
                        >
                          <span style={{ color: 'white', fontWeight: 'bold' }}>
                            {user.nickname?.[0] || user.username[0]}
                          </span>
                        </div>
                        {user.nickname || user.username}
                      </div>
                    }
                    id="user-dropdown"
                  >
                    <NavDropdown.Item as={Link} to="/profile">个人中心</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/my/posts">我的帖子</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/settings">设置</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      退出登录
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
              {!user && (
                <>
                  <Button as={Link} to="/login" variant="outline-primary" className="me-2">
                    登录
                  </Button>
                  <Button as={Link} to="/register" variant="primary">
                    注册
                  </Button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {user && showChat && (
        <ChatWindow
          onClose={() => setShowChat(false)}
          onMinimize={() => { }}
          onMaximize={() => { }}
        />
      )}
    </>
  );
};

export default Header;