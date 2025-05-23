import React from 'react';
import { Link } from 'react-router-dom';

// 模拟板块数据
const forums = [
  {
    id: 1,
    name: "课程交流",
    description: "分享学习资料，讨论课程问题",
    icon: "fa-book",
    posts: 1245,
    todayPosts: 23,
    color: "primary",
    moderators: ["学霸一号", "助教小王"]
  },
  {
    id: 2,
    name: "失物招领",
    description: "丢失物品发布，拾到物品归还",
    icon: "fa-search",
    posts: 856,
    todayPosts: 12,
    color: "success",
    moderators: ["热心同学"]
  },
  {
    id: 3,
    name: "树洞",
    description: "匿名分享心情，倾诉烦恼",
    icon: "fa-comments",
    posts: 2367,
    todayPosts: 45,
    color: "danger",
    moderators: ["心理老师", "树洞管理员"]
  },
  {
    id: 4,
    name: "表白墙",
    description: "勇敢表达爱意，传递美好情感",
    icon: "fa-heart",
    posts: 1589,
    todayPosts: 18,
    color: "warning",
    moderators: ["红娘小助手"]
  },
  {
    id: 5,
    name: "组队",
    description: "寻找队友，组建团队",
    icon: "fa-users",
    posts: 743,
    todayPosts: 8,
    color: "info",
    moderators: ["组队达人"]
  },
  {
    id: 6,
    name: "校园活动",
    description: "校园活动发布与讨论",
    icon: "fa-calendar",
    posts: 932,
    todayPosts: 15,
    color: "secondary",
    moderators: ["活动组织者", "学生会"]
  },
  {
    id: 7,
    name: "日常生活",
    description: "分享校园生活点滴",
    icon: "fa-coffee",
    posts: 1876,
    todayPosts: 32,
    color: "dark",
    moderators: ["生活达人"]
  },
  {
    id: 8,
    name: "学术科研",
    description: "学术讨论，科研交流",
    icon: "fa-flask",
    posts: 654,
    todayPosts: 6,
    color: "primary",
    moderators: ["科研大佬", "导师助理"]
  }
];

const ForumListPage = () => {
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
                  <div className={`forum-icon bg-${forum.color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} style={{width: '50px', height: '50px'}}>
                    <i className={`fas ${forum.icon} fa-lg`}></i>
                  </div>
                  <div>
                    <h5 className="card-title mb-1">{forum.name}</h5>
                    <small className="text-muted">今日新帖: {forum.todayPosts}</small>
                  </div>
                </div>
                
                <p className="card-text text-muted mb-3">{forum.description}</p>
                
                <div className="forum-stats mb-3">
                  <div className="row text-center">
                    <div className="col-6">
                      <div className="stat-number text-primary fw-bold">{forum.posts}</div>
                      <div className="stat-label small text-muted">总帖数</div>
                    </div>
                    <div className="col-6">
                      <div className="stat-number text-success fw-bold">{forum.todayPosts}</div>
                      <div className="stat-label small text-muted">今日新帖</div>
                    </div>
                  </div>
                </div>
                
                <div className="moderators mb-3">
                  <small className="text-muted">版主: </small>
                  {forum.moderators.map((mod, index) => (
                    <span key={index}>
                      <small className="badge bg-light text-dark me-1">{mod}</small>
                    </span>
                  ))}
                </div>
                
                <Link to={`/forum/${forum.id}`} className={`btn btn-${forum.color} w-100`}>
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
                    <div className="stat-number h3 text-primary">{forums.length}</div>
                    <div className="stat-label text-muted">总板块数</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-box">
                    <div className="stat-number h3 text-success">{forums.reduce((sum, forum) => sum + forum.posts, 0)}</div>
                    <div className="stat-label text-muted">总帖子数</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-box">
                    <div className="stat-number h3 text-warning">{forums.reduce((sum, forum) => sum + forum.todayPosts, 0)}</div>
                    <div className="stat-label text-muted">今日新帖</div>
                  </div>
                </div>
                <div className="col-md-3 mb-3">
                  <div className="stat-box">
                    <div className="stat-number h3 text-info">{forums.reduce((sum, forum) => sum + forum.moderators.length, 0)}</div>
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