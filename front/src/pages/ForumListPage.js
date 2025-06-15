import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getForums, getForumStats } from '../api/forums';

const ForumListPage = () => {
  const [forums, setForums] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [forumsData, statsData] = await Promise.all([
          getForums(),
          getForumStats()
        ]);
        console.log('获取到的板块数据:', forumsData);
        console.log('获取到的统计数据:', statsData);
        setForums(forumsData.forums);
        setStats(statsData);
        setLoading(false);
      } catch (err) {
        setError('获取数据失败');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger m-3" role="alert">
        {error}
      </div>
    );
  }

  return (
    <div className="forum-list-page container py-4">
      <div className="row mb-4">
        <div className="col-12">
          <h2><i className="fas fa-list me-2"></i>板块列表</h2>
          <p className="text-muted">选择感兴趣的板块，参与讨论交流</p>
        </div>
      </div>
      
      <div className="row">
        {forums.map(forum => (
          <div key={forum.id} className="col-md-6 col-lg-4 mb-4">
            <div className="card h-100 forum-card">
              <div className="card-body">
                <div className="d-flex align-items-center mb-3">
                  <div className={`forum-icon bg-${forum.color || 'primary'} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} style={{width: '50px', height: '50px'}}>
                    <i className={`fas ${forum.icon || 'fa-comments'} fa-lg`}></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-1">{forum.name}</h5>
                    <small className="text-muted">今日新帖: {forum.today_posts_count || 0}</small>
                  </div>
                </div>
                
                <p className="card-text text-muted mb-3">{forum.description}</p>
                
                <div className="forum-stats mb-3">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="stat-number text-primary fw-bold">{forum.total_post_count || 0}</div>
                      <div className="stat-label small text-muted">总帖数</div>
                    </div>
                    <div className="col-6">
                      <div className="stat-number text-success fw-bold">{forum.today_posts_count || 0}</div>
                      <div className="stat-label small text-muted">今日新帖</div>
                    </div>
                  </div>
                </div>
                
                {forum.moderator && (
                  <div className="moderators mb-3">
                    <small className="text-muted">版主: </small>
                    <span>
                      <small className="badge bg-light text-dark me-1">{forum.moderator.username}</small>
                    </span>
                  </div>
                )}
                
                <Link to={`/forum/${forum.id}`} className={`btn btn-${forum.color || 'primary'} w-100`}>
                  进入板块
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* 板块统计 */}
      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0"><i className="fas fa-chart-bar me-2"></i>板块统计</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-md-3 mb-3">
                  <div className="stat-box">
                    <div className="stat-number h3 text-primary">{stats?.total_forums || 0}</div>
                    <div className="stat-label text-muted">总板块数</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-box">
                    <div className="stat-number h3 text-success">{stats?.total_posts || 0}</div>
                    <div className="stat-label text-muted">总帖子数</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-box">
                    <div className="stat-number h3 text-warning">{stats?.today_posts || 0}</div>
                    <div className="stat-label text-muted">今日新帖</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-box">
                    <div className="stat-number h3 text-info">{stats?.total_moderators || 0}</div>
                    <div className="stat-label text-muted">版主总数</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumListPage;