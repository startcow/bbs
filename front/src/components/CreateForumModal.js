import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createForum } from '../api/forums';
import '../styles/CreateForumModal.css';

const CreateForumModal = ({ show, onHide, onForumCreated }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: 'fa-comments'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const iconOptions = [
    { value: 'fa-comments', label: '💬 讨论' },
    { value: 'fa-book', label: '📚 学习' },
    { value: 'fa-search', label: '🔍 寻找' },
    { value: 'fa-heart', label: '❤️ 情感' },
    { value: 'fa-users', label: '👥 团队' },
    { value: 'fa-calendar', label: '📅 活动' },
    { value: 'fa-flask', label: '🧪 科研' },
    { value: 'fa-coffee', label: '☕ 生活' },
    { value: 'fa-gamepad', label: '🎮 游戏' },
    { value: 'fa-music', label: '🎵 音乐' },
    { value: 'fa-camera', label: '📷 摄影' },
    { value: 'fa-code', label: '💻 编程' }
  ];

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // 清除错误信息
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 表单验证
    if (!formData.name.trim()) {
      setError('板块名称不能为空');
      return;
    }
    
    if (!formData.description.trim()) {
      setError('板块描述不能为空');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await createForum(formData);
      setSuccess('板块创建成功！');
      
      // 通知父组件刷新板块列表
      if (onForumCreated) {
        onForumCreated(response.forum);
      }
      
      // 重置表单
      setFormData({
        name: '',
        description: '',
        icon: 'fa-comments'
      });
      
      // 延迟关闭模态框
      setTimeout(() => {
        onHide();
        setSuccess('');
      }, 1500);
      
    } catch (err) {
      setError(err.response?.data?.message || '创建板块失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      icon: 'fa-comments'
    });
    setError('');
    setSuccess('');
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} centered className="create-forum-modal">
      <Modal.Header closeButton>
        <Modal.Title>
          <i className="fas fa-plus-circle me-2"></i>
          创建新板块
        </Modal.Title>
      </Modal.Header>
      
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {error && (
            <Alert variant="danger" className="mb-3">
              <i className="fas fa-exclamation-triangle me-2"></i>
              {error}
            </Alert>
          )}
          
          {success && (
            <Alert variant="success" className="mb-3">
              <i className="fas fa-check-circle me-2"></i>
              {success}
            </Alert>
          )}
          
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fas fa-tag me-2"></i>
              板块名称 <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="请输入板块名称"
              maxLength={50}
              required
            />
            <Form.Text className="text-muted">
              板块名称应简洁明了，最多50个字符
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fas fa-align-left me-2"></i>
              板块描述 <span className="text-danger">*</span>
            </Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="请输入板块描述，介绍板块的主要用途和讨论内容"
              maxLength={200}
              required
            />
            <Form.Text className="text-muted">
              详细描述板块的用途和讨论范围，最多200个字符
            </Form.Text>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>
              <i className="fas fa-icons me-2"></i>
              板块图标
            </Form.Label>
            <Form.Select
              name="icon"
              value={formData.icon}
              onChange={handleInputChange}
            >
              {iconOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
            <Form.Text className="text-muted">
              选择一个合适的图标来代表您的板块
            </Form.Text>
          </Form.Group>
          
          <div className="preview-section p-3 bg-light rounded">
            <h6 className="mb-2">
              <i className="fas fa-eye me-2"></i>
              预览效果
            </h6>
            <div className="d-flex align-items-center">
              <div className="forum-icon bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                   style={{width: '50px', height: '50px'}}>
                <i className={`fas ${formData.icon} fa-lg`}></i>
              </div>
              <div>
                <h6 className="mb-1">{formData.name || '板块名称'}</h6>
                <small className="text-muted">{formData.description || '板块描述'}</small>
              </div>
            </div>
          </div>
        </Modal.Body>
        
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            <i className="fas fa-times me-2"></i>
            取消
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                创建中...
              </>
            ) : (
              <>
                <i className="fas fa-plus me-2"></i>
                创建板块
              </>
            )}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default CreateForumModal;