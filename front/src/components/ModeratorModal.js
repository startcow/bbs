import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { mockUsers } from '../mockData/tempData';

const ModeratorModal = ({ show, onHide, forumId, onAddModerator }) => {
  const [selectedUser, setSelectedUser] = useState('');

  const regularUsers = mockUsers.filter(user => user.role === 'user');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedUser) return;
    
    onAddModerator(selectedUser);
    setSelectedUser('');
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>添加版主</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>选择用户</Form.Label>
            <Form.Select 
              value={selectedUser}
              onChange={(e) => setSelectedUser(e.target.value)}
              required
            >
              <option value="">请选择用户</option>
              {regularUsers.map(user => (
                <option key={user.id} value={user.id}>
                  {user.username}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={onHide}>
              取消
            </Button>
            <Button type="submit" variant="primary">
              添加
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default ModeratorModal;