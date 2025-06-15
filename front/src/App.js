import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser, setToken } from './store/slices/authSlice';
import storage from './utils/storage';
import './App.css';

// 导入组件
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ForumListPage from './pages/ForumListPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PostDetailPage from './pages/PostDetailPage';
import SearchResultPage from './pages/SearchResultPage';
import ForumDetailPage from './pages/ForumDetailPage';
import CreatePostPage from './pages/CreatePostPage';
import ProfileSettingsPage from './pages/ProfileSettingsPage';
import ProfilePage from './pages/ProfilePage';
import PostListPage from './pages/PostListPage';

function App() {
  const dispatch = useDispatch();

  // 应用启动时恢复用户登录状态
  useEffect(() => {
    const token = storage.getItem('token');
    const user = storage.getItem('user');
    
    if (token && user) {
      dispatch(setToken(token));
      dispatch(setUser(user));
    }
  }, [dispatch]);
  return (
    <Router>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/forums" element={<ForumListPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/post/:id" element={<PostDetailPage />} />
            <Route path="/search" element={<SearchResultPage />} />
            <Route path="/forum/:id" element={<ForumDetailPage />} />
            <Route path="/create-post" element={<CreatePostPage />} />
            <Route path="/settings" element={<ProfileSettingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/posts" element={<PostListPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
