import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Nav, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';

const ProfileSettingsPage = () => {
  const { user } = useSelector(state => state.auth);
  const [activeTab, setActiveTab] = useState('basic');
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    mentionNotifications: true,
    replyNotifications: true
  });
  const [message, setMessage] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    try {
      // 这里添加实际的API调用
      console.log('更新个人信息：', profileData);
      setMessage({ type: 'success', text: '个人信息更新成功！' });
    } catch (error) {
      setMessage({ type: 'danger', text: '更新失败，请重试' });
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', text: '两次输入的密码不一致' });
      return;
    }
    try {
      // 这里添加实际的API调用
      console.log('更新密码：', passwordData);
      setMessage({ type: 'success', text: '密码修改成功！' });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setMessage({ type: 'danger', text: '密码修改失败，请重试' });
    }
  };

  const handleNotificationSubmit = async (e) => {
    e.preventDefault();
    try {
      // 这里添加实际的API调用
      console.log('更新通知设置：', notificationSettings);
      setMessage({ type: 'success', text: '通知设置更新成功！' });
    } catch (error) {
      setMessage({ type: 'danger', text: '设置更新失败，请重试' });
    }
  };

  return (
    <Container className="py-4">
      <Row>
        <Col md={3}>
          <Card className="mb-4">
            <Card.Header>设置</Card.Header>
            <Card.Body className="p-0">
              <Nav className="flex-column" variant="pills">
                <Nav.Link 
                  active={activeTab === 'basic'}
                  onClick={() => setActiveTab('basic')}
                  className="rounded-0"
                >
                  基本信息
                </Nav.Link>
                <Nav.Link 
                  active={activeTab === 'password'}
                  onClick={() => setActiveTab('password')}
                  className="rounded-0"
                >
                  修改密码
                </Nav.Link>
                <Nav.Link 
                  active={activeTab === 'notification'}
                  onClick={() => setActiveTab('notification')}
                  className="rounded-0"
                >
                  通知设置
                </Nav.Link>
              </Nav>
            </Card.Body>
          </Card>
        </Col>
        
        <Col md={9}>
          {message && (
            <Alert variant={message.type} dismissible onClose={() => setMessage(null)}>
              {message.text}
            </Alert>
          )}

          {activeTab === 'basic' && (
            <Card>
              <Card.Header>基本信息</Card.Header>
              <Card.Body>
                <Form onSubmit={handleProfileSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>用户名</Form.Label>
                    <Form.Control
                      type="text"
                      value={profileData.username}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        username: e.target.value
                      }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>邮箱</Form.Label>
                    <Form.Control
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        email: e.target.value
                      }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>头像</Form.Label>
                    <div className="d-flex align-items-center gap-3 mb-2">
                      <img
                        src={profileData.avatar}
                        alt="avatar"
                        className="rounded-circle"
                        width="64"
                        height="64"
                        onError={(e) => e.target.src = '/avatar-default.jpg'}
                      />
                      <Button variant="outline-primary" size="sm">
                        更换头像
                      </Button>
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>个人简介</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={profileData.bio}
                      onChange={(e) => setProfileData(prev => ({
                        ...prev,
                        bio: e.target.value
                      }))}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    保存更改
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'password' && (
            <Card>
              <Card.Header>修改密码</Card.Header>
              <Card.Body>
                <Form onSubmit={handlePasswordSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>当前密码</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        currentPassword: e.target.value
                      }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>新密码</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        newPassword: e.target.value
                      }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>确认新密码</Form.Label>
                    <Form.Control
                      type="password"
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({
                        ...prev,
                        confirmPassword: e.target.value
                      }))}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    修改密码
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}

          {activeTab === 'notification' && (
            <Card>
              <Card.Header>通知设置</Card.Header>
              <Card.Body>
                <Form onSubmit={handleNotificationSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="email-notifications"
                      label="接收邮件通知"
                      checked={notificationSettings.emailNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        emailNotifications: e.target.checked
                      }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="mention-notifications"
                      label="有人@我时通知"
                      checked={notificationSettings.mentionNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        mentionNotifications: e.target.checked
                      }))}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Check
                      type="switch"
                      id="reply-notifications"
                      label="收到回复时通知"
                      checked={notificationSettings.replyNotifications}
                      onChange={(e) => setNotificationSettings(prev => ({
                        ...prev,
                        replyNotifications: e.target.checked
                      }))}
                    />
                  </Form.Group>

                  <Button type="submit" variant="primary">
                    保存设置
                  </Button>
                </Form>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ProfileSettingsPage;