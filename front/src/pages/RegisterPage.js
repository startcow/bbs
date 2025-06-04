import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../api/auth';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    studentId: '',
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
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
    
    if (!formData.studentId.trim()) {
      newErrors.studentId = '请输入学号';
    }
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else if (formData.username.length < 2) {
      newErrors.username = '用户名至少2个字符';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }
    
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 6) {
      newErrors.password = '密码至少6位';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次密码不一致';
    }
    
    if (!formData.agreeTerms) {
      newErrors.agreeTerms = '请同意用户协议';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        await register({
          studentId: formData.studentId,
          username: formData.username,
          email: formData.email,
          password: formData.password
        });
        alert('注册成功！请登录');
        navigate('/login');
      } catch (error) {
        setErrors({
          general: error.response?.data?.message || '注册失败，请重试'
        });
      }
    }
  };

  return (
    <div className="register-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-6">
            <div className="card shadow">
              <div className="card-body p-5">
                <div className="text-center mb-4">
                  <h2 className="text-primary">注册果壳校园</h2>
                  <p className="text-muted">加入我们，开启精彩的校园生活</p>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="studentId" className="form-label">学号 *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.studentId ? 'is-invalid' : ''}`}
                        id="studentId"
                        name="studentId"
                        value={formData.studentId}
                        onChange={handleChange}
                        placeholder="请输入学号"
                      />
                      {errors.studentId && (
                        <div className="invalid-feedback">{errors.studentId}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="username" className="form-label">用户名 *</label>
                      <input
                        type="text"
                        className={`form-control ${errors.username ? 'is-invalid' : ''}`}
                        id="username"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="请输入用户名"
                      />
                      {errors.username && (
                        <div className="invalid-feedback">{errors.username}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">邮箱 *</label>
                    <input
                      type="email"
                      className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="请输入邮箱地址"
                    />
                    {errors.email && (
                      <div className="invalid-feedback">{errors.email}</div>
                    )}
                  </div>
                  
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="password" className="form-label">密码 *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                        id="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="请输入密码"
                      />
                      {errors.password && (
                        <div className="invalid-feedback">{errors.password}</div>
                      )}
                    </div>
                    
                    <div className="col-md-6 mb-3">
                      <label htmlFor="confirmPassword" className="form-label">确认密码 *</label>
                      <input
                        type="password"
                        className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="请再次输入密码"
                      />
                      {errors.confirmPassword && (
                        <div className="invalid-feedback">{errors.confirmPassword}</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="mb-3 form-check">
                    <input
                      type="checkbox"
                      className={`form-check-input ${errors.agreeTerms ? 'is-invalid' : ''}`}
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                    />
                    <label className="form-check-label" htmlFor="agreeTerms">
                      我已阅读并同意
                      <Link to="/terms" className="text-decoration-none ms-1">用户协议</Link>
                      和
                      <Link to="/privacy" className="text-decoration-none ms-1">隐私政策</Link>
                    </label>
                    {errors.agreeTerms && (
                      <div className="invalid-feedback d-block">{errors.agreeTerms}</div>
                    )}
                  </div>
                  
                  <button type="submit" className="btn btn-primary w-100 mb-3">
                    <i className="fas fa-user-plus me-2"></i>注册
                  </button>
                </form>
                
                <hr className="my-4" />
                
                {/* 第三方注册 */}
                {/* <div className="text-center mb-3">
                  <p className="text-muted mb-3">或使用以下方式快速注册</p>
                  <div className="d-grid gap-2">
                    <button className="btn btn-outline-success">
                      <i className="fab fa-weixin me-2"></i>微信注册
                    </button>
                    <button className="btn btn-outline-primary">
                      <i className="fab fa-qq me-2"></i>QQ注册
                    </button>
                  </div>
                </div> */}
                
                <div className="text-center">
                  <span className="text-muted">已有账号？</span>
                  <Link to="/login" className="text-decoration-none ms-1">
                    立即登录
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;