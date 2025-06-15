import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import storage from '../utils/storage';
import { login } from '../api/auth';

// 工具函数：记住的用户信息存储
function getRememberedUsers() {
  return JSON.parse(localStorage.getItem('rememberedUsers') || '[]');
}
function saveRememberedUser(username, password) {
  let users = getRememberedUsers();
  users = users.filter(u => u.username !== username);
  users.unshift({ username, password });
  localStorage.setItem('rememberedUsers', JSON.stringify(users));
}
function removeRememberedUser(username) {
  let users = getRememberedUsers();
  users = users.filter(u => u.username !== username);
  localStorage.setItem('rememberedUsers', JSON.stringify(users));
}

const LoginPage = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    rememberMe: false
  });
  const [errors, setErrors] = useState({});
  const [rememberedUsers, setRememberedUsers] = useState([]);
  const navigate = useNavigate();

  // 页面加载时自动读取本地存储
  useEffect(() => {
    const users = getRememberedUsers();
    setRememberedUsers(users);
    if (users.length > 0) {
      setFormData(prev => ({
        ...prev,
        username: users[0].username,
        password: users[0].password,
        rememberMe: true
      }));
    }
  }, []);

  // 用户名选择时自动填充密码
  const handleUsernameChange = (e) => {
    const username = e.target.value;
    const user = rememberedUsers.find(u => u.username === username);
    setFormData(prev => ({
      ...prev,
      username,
      password: user ? user.password : '',
    }));
  };

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        const response = await login({
          username: formData.username,
          password: formData.password
        });
        storage.setItem('token', response.access_token);
        storage.setItem('user', response.user);
        dispatch({ type: 'auth/setUser', payload: response.user });
        if (formData.rememberMe) {
          saveRememberedUser(formData.username, formData.password);
        } else {
          removeRememberedUser(formData.username);
        }
        navigate('/');
      } catch (error) {
        setErrors({
          general: error.message || '登录失败，请检查用户名和密码'
        });
      }
    }
  };

  return (
    <div className="login-page" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', minHeight: '100vh', paddingTop: '5rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={6} lg={4}>
            <Card className="shadow-lg border-0" style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5">
                {errors.general && (
                  <Alert variant="danger" className="mb-3">
                    {errors.general}
                  </Alert>
                )}
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
                  <h2 className="h4" style={{ color: '#667eea' }}>登录果壳校园</h2>
                  <p className="text-muted">欢迎回来！请登录您的账户</p>
                </div>

                <Form onSubmit={handleSubmit} autoComplete="on">
                  <Form.Group className="mb-3">
                    <Form.Label>学号/邮箱</Form.Label>
                    <Form.Control
                      list="user-list"
                      name="username"
                      value={formData.username}
                      onChange={handleUsernameChange}
                      placeholder="请输入学号或邮箱"
                      autoComplete="username"
                      isInvalid={!!errors.username}
                      style={{ borderRadius: '10px', padding: '12px' }}
                    />
                    <datalist id="user-list">
                      {rememberedUsers.map(u => (
                        <option key={u.username} value={u.username} />
                      ))}
                    </datalist>
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
                      autoComplete="current-password"
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