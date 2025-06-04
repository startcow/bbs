import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Form, Button, Card } from 'react-bootstrap';
import { getForums } from '../api/forums';
import { createPost } from '../api/posts';

const CreatePostPage = () => {
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [forums, setForums] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    forumId: '',
    tags: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchForums = async () => {
      try {
        const response = await getForums();
        setForums(response.forums || []);
      } catch (err) {
        console.error('获取板块失败:', err);
        setError('获取板块列表失败');
      }
    };
    fetchForums();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsSaving(true);
      setError('');

      if (!formData.forumId) {
        throw new Error('请选择板块');
      }      if (!formData.title.trim() || !formData.content.trim()) {
        throw new Error('标题和内容不能为空');
      }

      const postData = {
        title: formData.title.trim(),
        content: formData.content.trim(),
        forum_id: Number(formData.forumId)
      };     
      console.log('postData', postData);
      const response = await createPost(postData);
      navigate(`/post/${response.post.id}`);
    } catch (error) {
      setError(error.message || '发帖失败');
      console.error('发帖失败：', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container className="py-4">
      <Card>
        <Card.Header>
          <h4 className="mb-0">发表新帖</h4>
        </Card.Header>
        <Card.Body>
          {error && (
            <div className="alert alert-danger mb-3">
              {error}
            </div>
          )}
          
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>选择板块 <span className="text-danger">*</span></Form.Label>
              <Form.Select 
                name="forumId" 
                value={formData.forumId}
                onChange={handleChange}
                required
              >
                <option value="">请选择板块</option>
                {forums.map(forum => (
                  <option key={forum.id} value={forum.id}>
                    {forum.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>标题 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="请输入帖子标题"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>内容 <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={10}
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="请输入帖子内容"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>标签</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="使用逗号分隔多个标签"
              />
              <Form.Text className="text-muted">
                最多添加5个标签，使用逗号分隔
              </Form.Text>
            </Form.Group>

            <div className="d-flex gap-2">
              <Button 
                type="submit" 
                variant="primary"
                disabled={isSaving}
              >
                {isSaving ? '发布中...' : '发布'}
              </Button>
              <Button 
                type="button" 
                variant="outline-secondary" 
                onClick={() => navigate(-1)}
              >
                取消
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default CreatePostPage;