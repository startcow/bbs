import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '请输入学号或邮箱';
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // 这里应该调用登录API
      console.log('登录数据:', formData);
      // 模拟登录成功
      alert('登录成功！');
      navigate('/');
    }
  };

  return (
    <div className="login-page" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', paddingTop: '5rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <div 
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      borderRadius: '20px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 1rem'
                    }}
                  >
                    <span style={{ color: 'white', fontSize: '2rem', fontWeight: 'bold' }}>🎓</span>
                  </div>
                  <h2 className="h4" style={{ color: '#667eea' }}>登录校园BBS</h2>
                  <p className="text-muted">欢迎回来！请登录您的账户</p>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>学号/邮箱</Form.Label>
                    <Form.Control
                      type="text"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      placeholder="请输入学号或邮箱"
                      isInvalid={!!errors.username}
                      style={{ borderRadius: '10px', padding: '12px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.username}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>密码</Form.Label>
                    <Form.Control
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="请输入密码"
                      isInvalid={!!errors.password}
                      style={{ borderRadius: '10px', padding: '12px' }}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.password}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="checkbox"
                      id="rememberMe"
                      name="rememberMe"
                      label="记住我"
                      checked={formData.rememberMe}
                      onChange={handleChange}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="w-100 mb-3"
                    style={{
                      background: 'linear-gradient(45deg, #667eea, #764ba2)',
                      border: 'none',
                      borderRadius: '25px',
                      padding: '12px',
                      fontWeight: '500'
                    }}
                  >
                    登录
                  </Button>
                </Form>

                <div className="text-center">
                  <Link to="/forgot-password" className="text-decoration-none small" style={{ color: '#667eea' }}>
                    忘记密码？
                  </Link>
                </div>

                <hr className="my-4" />

                <div className="text-center">
                  <p className="text-muted small mb-3">或使用第三方登录</p>
                  <div className="d-grid gap-2">
                    <Button variant="outline-success" style={{ borderRadius: '15px' }}>
                      💬 微信登录
                    </Button>
                    <Button variant="outline-info" style={{ borderRadius: '15px' }}>
                      🐧 QQ登录
                    </Button>
                  </div>
                </div>

                <div className="text-center mt-4">
                  <p className="text-muted small">
                    还没有账户？
                    <Link to="/register" className="text-decoration-none ms-1" style={{ color: '#667eea', fontWeight: '500' }}>
                      立即注册
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default LoginPage;