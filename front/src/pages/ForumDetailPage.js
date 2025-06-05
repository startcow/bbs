import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { isAdmin, isModerator } from '../utils/permissions';
import ModeratorModal from '../components/ModeratorModal';
import { getForum, getForumPosts, addModerator, removeModerator } from '../api/forums';

const ForumDetailPage = () => {
  const { id } = useParams();
  const { user } = useSelector(state => state.auth);
  const [forum, setForum] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('latest');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showModeratorModal, setShowModeratorModal] = useState(false);
  useEffect(() => {
    const fetchForumData = async () => {
      try {
        setLoading(true);
        const forumResponse = await getForum(id);
        const postsResponse = await getForumPosts(id, {
          page,
          per_page: 20,
          sort_by: sortBy
        });
        console.log('获取到的板块数据:', postsResponse.posts);
        console.log('后端返回的总页数:', postsResponse.pages);
        setForum(forumResponse);
        setPosts(postsResponse.posts);
        setTotalPages(postsResponse.pages);
        setLoading(false);
      } catch (err) {
        setError(err.message || '加载失败');
        setLoading(false);
      }
    };

    fetchForumData();
  }, [id, page, sortBy]);
  const handleAddModerator = async (userId) => {
    try {
      await addModerator(id, userId);
      // 重新获取板块信息以更新版主列表
      const { data: forumData } = await getForum(id);
      setForum(forumData);
    } catch (error) {
      console.error('添加版主失败:', error);
    }
  };
  const handleRemoveModerator = async (moderatorId) => {
    if (!window.confirm('确定要移除该版主吗？')) return;

    try {
      await removeModerator(id, moderatorId);
      // 重新获取板块信息以更新版主列表
      const { data: forumData } = await getForum(id);
      setForum(forumData);
    } catch (error) {
      console.error('移除版主失败:', error);
    }
  };

  if (loading) return <div className="text-center py-5">加载中...</div>;
  if (error) return <div className="alert alert-danger m-4">{error}</div>;
  if (!forum) return <div className="alert alert-info m-4">板块不存在</div>;

  return (
    <div className="forum-detail-page container py-4">
      {/* 板块信息头部 */}
      <div className="card mb-4">
        <div className="card-body">
          <div className="d-flex align-items-center mb-3">
            <div className={`forum-icon bg-${forum.color} text-white rounded-circle d-flex align-items-center justify-content-center me-3`} style={{ width: '60px', height: '60px' }}>
              <i className={`fas ${forum.icon} fa-2x`}></i>
            </div>
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-1">{forum.name}</h2>
                {isAdmin(user) && (
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => setShowModeratorModal(true)}
                  >
                    <i className="fas fa-user-plus me-1"></i>
                    添加版主
                  </button>
                )}
              </div>
              <p className="text-muted mb-0">{forum.description}</p>
            </div>
          </div>

          {/* 版主列表 */}
          <div className="moderators-section mt-3">
            <h6 className="text-muted mb-2">版主</h6>
            <div className="d-flex flex-wrap gap-2">
              {forum.moderators?.length > 0 ? (
                forum.moderators.map(mod => (
                  <div key={mod.id} className="moderator-badge d-flex align-items-center bg-light rounded p-2">
                    <img
                      src={mod.avatar}
                      alt={mod.username}
                      className="rounded-circle me-2"
                      width="24"
                      height="24"
                    />
                    <span>{mod.username}</span>
                    {isAdmin(user) && (
                      <button
                        className="btn btn-link text-danger p-0 ms-2"
                        onClick={() => handleRemoveModerator(mod.id)}
                      >
                        <i className="fas fa-times"></i>
                      </button>
                    )}
                  </div>
                ))
              ) : (
                <span className="text-muted">暂无版主</span>
              )}
            </div>
          </div>

          <div className="row text-center mt-3">
            <div className="col-4">
              <div className="h4 mb-0">{forum.total_post_count}</div>
              <small className="text-muted">帖子</small>
            </div>
            <div className="col-4">
              <div className="h4 mb-0">{forum.todayPosts}</div>
              <small className="text-muted">今日</small>
            </div>
            <div className="col-4">
              <div className="h4 mb-0">{forum.followers}</div>
              <small className="text-muted">关注者</small>
            </div>
          </div>
        </div>
      </div>

      {/* 帖子列表工具栏 */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="btn-group">
          <button
            className={`btn ${sortBy === 'latest' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSortBy('latest')}
          >
            最新
          </button>
          <button
            className={`btn ${sortBy === 'hot' ? 'btn-primary' : 'btn-outline-primary'}`}
            onClick={() => setSortBy('hot')}
          >
            热门
          </button>
        </div>
        <Link to="/create-post" className="btn btn-primary">
          <i className="fas fa-plus me-1"></i>发帖
        </Link>
      </div>

      {/* 帖子列表 */}
      {posts.map(post => (
        <div key={post.id} className="card mb-3">
          <div className="card-body">
            <div className="d-flex">
              <img
                src={post.author.avatar}
                alt={post.author.username}
                className="rounded-circle me-3"
                width="48"
                height="48"
                onError={(e) => e.target.src = '/avatar-default.jpg'}
              />
              <div className="flex-grow-1">
                <h5 className="card-title mb-1">
                  <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                    {post.title}
                  </Link>
                </h5>
                <p className="text-muted small mb-2">
                  <span>{post.author.username}</span>
                  <span className="mx-1">•</span>
                  <span>{post.createdAt}</span>
                </p>
                <p className="card-text text-muted">{post.excerpt}</p>                <div className="d-flex gap-3">
                  <small className="text-muted">
                    <i className="far fa-thumbs-up me-1"></i>{post.like_count}
                  </small>
                  <small className="text-muted">
                    <i className="far fa-comment me-1"></i>{post.comment_count}
                  </small>
                  <small className="text-muted">
                    <i className="far fa-eye me-1"></i>{post.view_count}
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* 分页控件 */}
      <nav className="d-flex justify-content-center">
        <ul className="pagination">
          <li className={`page-item ${page === 1 ? 'disabled' : ''}`}>
            <button
              className="page-link"
              onClick={() => setPage(prev => prev - 1)}
              disabled={page === 1}
            >
              上一页
            </button>
          </li>
          <li className="page-item active">
            <span className="page-link">{page}</span>
          </li>
          <li className="page-item">
            <button
              className="page-link"
              onClick={() => setPage(prev => prev + 1)}
              disabled={page >= totalPages}
            >
              下一页
            </button>
          </li>
        </ul>
      </nav>

      <ModeratorModal
        show={showModeratorModal}
        onHide={() => setShowModeratorModal(false)}
        forumId={id}
        onAddModerator={handleAddModerator}
      />
    </div>
  );
};

export default ForumDetailPage;