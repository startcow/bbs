import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { getUsers } from '../api/users';
import { addModerator } from '../api/forums';

const ModeratorModal = ({ show, onHide, forumId, onAddModerator }) => {
  const [selectedUser, setSelectedUser] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // 重置状态
  const resetState = () => {
    setSelectedUser('');
    setUsers([]);
    setError('');
    setLoading(false);
    setSubmitting(false);
  };

  // 获取用户列表
  const fetchUsers = async () => {
    console.log('开始获取用户列表...');
    try {
      setLoading(true);
      setError('');
      
      const response = await getUsers({ role: 'user' });
      console.log('API响应:', response);
      
      if (response && Array.isArray(response.users)) {
        const userList = response.users;
        console.log('获取到用户列表:', userList);
        setUsers(userList);
        
        if (userList.length === 0) {
          setError('暂无可选择的普通用户');
        }
      } else {
        console.error('API响应格式错误:', response);
        setError('获取用户列表失败：响应格式错误');
      }
    } catch (error) {
      console.error('获取用户列表失败:', error);
      const errorMessage = error.response?.data?.message || error.message || '网络请求失败';
      setError(`获取用户列表失败: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  };

  // 当模态框显示时获取用户列表
  useEffect(() => {
    if (show) {
      console.log('模态框显示，开始获取用户列表');
      resetState();
      fetchUsers();
    } else {
      resetState();
    }
  }, [show]);

  // 过滤出普通用户
  const regularUsers = users.filter(user => user.role === 'user');
  console.log('过滤后的普通用户:', regularUsers);

  // 提交表单
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedUser) {
      setError('请选择一个用户');
      return;
    }
    
    if (!forumId) {
      setError('板块ID无效');
      return;
    }
    
    console.log('开始添加版主:', { forumId, selectedUser });
    
    try {
      setSubmitting(true);
      setError('');
      
      const response = await addModerator(forumId, selectedUser);
      console.log('添加版主成功:', response);
      
      // 立即关闭模态框
      onHide();
      
      // 调用父组件的回调函数
      if (onAddModerator) {
        await onAddModerator(selectedUser);
      }
      
    } catch (error) {
      console.error('添加版主失败:', error);
      const errorMessage = error.response?.data?.message || error.message || '添加版主失败';
      setError(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} backdrop="static">
      <Modal.Header closeButton>
        <Modal.Title>添加版主</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <Alert variant="danger" className="mb-3">
            <i className="fas fa-exclamation-triangle me-2"></i>
            {error}
          </Alert>
        )}
        
        {loading && (
          <div className="text-center mb-3">
            <Spinner animation="border" size="sm" className="me-2" />
            正在加载用户列表...
          </div>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>选择用户</Form.Label>
            <Form.Select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
              disabled={loading || submitting}
            >
              <option value="">
                {loading ? '加载中...' : regularUsers.length > 0 ? '请选择用户' : '暂无可选用户'}
              </option>
              {regularUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.nickname || user.username} ({user.username})
                </option>
              ))}
            </Form.Select>
            {regularUsers.length > 0 && (
              <Form.Text className="text-muted">
                共找到 {regularUsers.length} 个可选用户
              </Form.Text>
            )}
          </Form.Group>
          
          <div className="d-flex justify-content-end gap-2">
            <Button 
              variant="secondary" 
              onClick={onHide} 
              disabled={submitting}
            >
              取消
            </Button>
            <Button 
              type="submit" 
              variant="primary" 
              disabled={loading || submitting || !selectedUser || regularUsers.length === 0}
            >
              {submitting && <Spinner animation="border" size="sm" className="me-2" />}
              {submitting ? '添加中...' : '添加'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModeratorModal;