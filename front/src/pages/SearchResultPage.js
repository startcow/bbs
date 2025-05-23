import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';

// 模拟搜索结果数据
const mockSearchResults = {
  posts: [
    {
      id: 1,
      title: "期末复习资料分享",
      content: "大家好！期末考试快到了，我整理了一些复习资料想和大家分享...",
      author: "学霸一号",
      forum: "课程交流",
      createdAt: "2023-06-15",
      likes: 156,
      comments: 42
    },
    {
      id: 2,
      title: "数学建模竞赛组队",
      content: "寻找一起参加数学建模比赛的队友，有兴趣的同学请联系我...",
      author: "数模爱好者",
      forum: "组队",
      createdAt: "2023-06-14",
      likes: 37,
      comments: 15
    },
    {
      id: 3,
      title: "线性代数学习心得",
      content: "分享一些线性代数的学习方法和解题技巧...",
      author: "数学达人",
      forum: "课程交流",
      createdAt: "2023-06-13",
      likes: 89,
      comments: 23
    }
  ],
  users: [
    {
      id: 1,
      username: "学霸一号",
      avatar: "/avatar1.jpg",
      level: "资深会员",
      posts: 156,
      followers: 1234
    },
    {
      id: 2,
      username: "数学达人",
      avatar: "/avatar2.jpg",
      level: "活跃用户",
      posts: 89,
      followers: 567
    }
  ],
  topics: [
    {
      id: 1,
      name: "期末复习",
      posts: 234,
      followers: 1567
    },
    {
      id: 2,
      name: "数学建模",
      posts: 89,
      followers: 456
    },
    {
      id: 3,
      name: "线性代数",
      posts: 123,
      followers: 789
    }
  ]
};

const SearchResultPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState('posts');
  const [results, setResults] = useState(mockSearchResults);
  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    if (query) {
      setLoading(true);
      // 模拟搜索API调用
      setTimeout(() => {
        // 这里应该调用真实的搜索API
        setResults(mockSearchResults);
        setLoading(false);
      }, 500);
    }
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
              <span className="badge bg-secondary">{post.forum}</span>
            </div>
            <p className="card-text text-muted" dangerouslySetInnerHTML={{__html: highlightText(post.content.substring(0, 200) + '...', query)}}></p>
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <small className="text-muted">作者: {post.author} • {post.createdAt}</small>
              </div>
              <div>
                <small className="me-3"><i className="far fa-thumbs-up me-1"></i>{post.likes}</small>
                <small><i className="far fa-comment me-1"></i>{post.comments}</small>
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
                <img src={user.avatar} alt={user.username} className="rounded-circle mb-3" width="60" height="60" onError={(e) => e.target.src = '/avatar-default.jpg'} />
                <h6 className="card-title" dangerouslySetInnerHTML={{__html: highlightText(user.username, query)}}></h6>
                <p className="text-muted small">{user.level}</p>
                <div className="row text-center mb-3">
                  <div className="col-6">
                    <div className="fw-bold">{user.posts}</div>
                    <small className="text-muted">帖子</small>
                  </div>
                  <div className="col-6">
                    <div className="fw-bold">{user.followers}</div>
                    <small className="text-muted">关注者</small>
                  </div>
                </div>
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

  const renderTopics = () => (
    <div className="topics-results">
      <div className="row">
        {results.topics.map(topic => (
          <div key={topic.id} className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body text-center">
                <h6 className="card-title">
                  <span className="badge bg-primary me-2">#</span>
                  <span dangerouslySetInnerHTML={{__html: highlightText(topic.name, query)}}></span>
                </h6>
                <div className="row text-center mb-3">
                  <div className="col-6">
                    <div className="fw-bold">{topic.posts}</div>
                    <small className="text-muted">帖子</small>
                  </div>
                  <div className="col-6">
                    <div className="fw-bold">{topic.followers}</div>
                    <small className="text-muted">关注</small>
                  </div>
                </div>
                <button className="btn btn-outline-primary btn-sm">
                  <i className="fas fa-plus me-1"></i>关注话题
                </button>
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
            找到 {results.posts.length + results.users.length + results.topics.length} 个结果
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
                className={`nav-link ${activeTab === 'topics' ? 'active' : ''}`}
                onClick={() => setActiveTab('topics')}
              >
                <i className="fas fa-hashtag me-1"></i>
                话题 ({results.topics.length})
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
              {activeTab === 'topics' && renderTopics()}
            </div>
          )}
        </div>

        {/* 右侧边栏 */}
        <div className="col-lg-3">
          {/* 搜索建议 */}
          <div className="card mb-4">
            <div className="card-header">
              <h6 className="mb-0">搜索建议</h6>
            </div>
            <div className="card-body">
              <div className="d-flex flex-wrap gap-1">
                <span className="badge bg-light text-dark">期末复习</span>
                <span className="badge bg-light text-dark">数学建模</span>
                <span className="badge bg-light text-dark">组队</span>
                <span className="badge bg-light text-dark">课程交流</span>
                <span className="badge bg-light text-dark">学习资料</span>
              </div>
            </div>
          </div>

          {/* 热门搜索 */}
          <div className="card">
            <div className="card-header">
              <h6 className="mb-0">热门搜索</h6>
            </div>
            <div className="card-body p-0">
              <div className="list-group list-group-flush">
                <Link to="/search?q=期末复习" className="list-group-item list-group-item-action">
                  <i className="fas fa-fire text-danger me-2"></i>期末复习
                </Link>
                <Link to="/search?q=数学建模" className="list-group-item list-group-item-action">
                  <i className="fas fa-fire text-danger me-2"></i>数学建模
                </Link>
                <Link to="/search?q=失物招领" className="list-group-item list-group-item-action">
                  <i className="fas fa-fire text-danger me-2"></i>失物招领
                </Link>
                <Link to="/search?q=校园活动" className="list-group-item list-group-item-action">
                  <i className="fas fa-fire text-danger me-2"></i>校园活动
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultPage;