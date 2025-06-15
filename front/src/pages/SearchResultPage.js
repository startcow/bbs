import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { search } from '../api/search';

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('keyword') || '';
  const [activeTab, setActiveTab] = useState('posts');
  const [results, setResults] = useState({ posts: [], users: [], forums: [] });
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (query) {
        setLoading(true);
        try {
          const data = await search(query);
          setResults(data);
        } catch (error) {
          console.error('搜索失败:', error);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchSearchResults();
  }, [query]);

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    // 这里应该重新排序结果
  };

  const highlightText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  const renderPosts = () => (
    <div className="posts-results">
      {results.posts.map(post => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex justify-content-between align-items-start mb-2">
              <Link to={`/post/${post.id}`} className="text-decoration-none">
                <h5 className="card-title" dangerouslySetInnerHTML={{__html: highlightText(post.title, query)}}></h5>
              </Link>
              <span className="badge bg-secondary">{post.forum.name}</span>
            </div>
            <p className="card-text text-muted" dangerouslySetInnerHTML={{__html: highlightText(post.content.substring(0, 200) + '...', query)}}></p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">作者: {post.author.nickname} • {post.created_at}</small>
              </div>
              <div>
                <small className="me-3"><i className="far fa-thumbs-up me-1"></i>{post.like_count}</small>
                <small><i className="far fa-comment me-1"></i>{post.comment_count}</small>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderUsers = () => (
    <div className="users-results">
      <div className="row">
        {results.users.map(user => (
          <div key={user.id} className="col-md-6 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <img src={user.avatar || '/avatar-default.jpg'} alt={user.username} className="rounded-circle mb-3" width="60" height="60" />
                <h6 className="card-title" dangerouslySetInnerHTML={{__html: highlightText(user.nickname || user.username, query)}}></h6>
                <p className="text-muted small">{user.role}</p>
                <button className="btn btn-primary btn-sm">
                  <i className="fas fa-plus me-1"></i>关注
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderForums = () => (
    <div className="forums-results">
      <div className="row">
        {results.forums.map(forum => (
          <div key={forum.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h6 className="card-title">
                  <span className="badge bg-primary me-2"><i className={`fas ${forum.icon}`}></i></span>
                  <span dangerouslySetInnerHTML={{__html: highlightText(forum.name, query)}}></span>
                </h6>
                <p className="text-muted small">{forum.description}</p>
                <div className="row text-center mb-3">
                  <div className="col-12">
                    <div className="fw-bold">{forum.post_count}</div>
                    <small className="text-muted">帖子</small>
                  </div>
                </div>
                <Link to={`/forum/${forum.id}`} className="btn btn-outline-primary btn-sm">
                  访问板块
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  if (!query) {
    return (
      <div className="search-result-page container py-4">
        <div className="text-center py-5">
          <i className="fas fa-search fa-3x text-muted mb-3"></i>
          <h3>请输入搜索关键词</h3>
          <p className="text-muted">搜索帖子、用户或话题</p>
        </div>
      </div>
    );
  }

  return (
    <div className="search-result-page container py-4">
      {/* 搜索结果头部 */}
      <div className="row mb-4">
        <div className="col-12">
          <h2>
            <i className="fas fa-search me-2"></i>
            搜索结果: "{query}"
          </h2>
          <p className="text-muted">
            找到 {results.posts.length + results.users.length + results.forums.length} 个结果
          </p>
        </div>
      </div>

      <div className="row">
        <div className="col-lg-9">
          {/* 标签页导航 */}
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'posts' ? 'active' : ''}`}
                onClick={() => setActiveTab('posts')}
              >
                <i className="fas fa-file-alt me-1"></i>
                帖子 ({results.posts.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'users' ? 'active' : ''}`}
                onClick={() => setActiveTab('users')}
              >
                <i className="fas fa-users me-1"></i>
                用户 ({results.users.length})
              </button>
            </li>
            <li className="nav-item">
              <button 
                className={`nav-link ${activeTab === 'forums' ? 'active' : ''}`}
                onClick={() => setActiveTab('forums')}
              >
                <i className="fas fa-list me-1"></i>
                板块 ({results.forums.length})
              </button>
            </li>
          </ul>

          {/* 排序选项 */}
          {activeTab === 'posts' && (
            <div className="d-flex justify-content-between align-items-center mb-3">
              <div>
                <span className="text-muted me-2">排序方式:</span>
                <div className="btn-group" role="group">
                  <button 
                    className={`btn btn-sm ${sortBy === 'relevance' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSortChange('relevance')}
                  >
                    相关性
                  </button>
                  <button 
                    className={`btn btn-sm ${sortBy === 'time' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSortChange('time')}
                  >
                    时间
                  </button>
                  <button 
                    className={`btn btn-sm ${sortBy === 'likes' ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => handleSortChange('likes')}
                  >
                    点赞数
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 搜索结果内容 */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">搜索中...</span>
              </div>
              <p className="mt-2">搜索中...</p>
            </div>
          ) : (
            <div className="search-results">
              {activeTab === 'posts' && renderPosts()}
              {activeTab === 'users' && renderUsers()}
              {activeTab === 'forums' && renderForums()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;