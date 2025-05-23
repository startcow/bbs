import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Form, Button, NavDropdown } from 'react-bootstrap';
import './Header.css';

const Header = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // 模拟登录状态

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
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
          <span className="fw-bold text-primary">校园BBS</span>
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
            {isLoggedIn ? (
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
                        U
                      </span>
                    </div>
                    用户
                  </div>
                }
                id="user-dropdown"
              >
                <NavDropdown.Item href="#">个人中心</NavDropdown.Item>
                <NavDropdown.Item href="#">我的帖子</NavDropdown.Item>
                <NavDropdown.Item href="#">设置</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => setIsLoggedIn(false)}>
                  退出登录
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
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
  );
};

export default Header;