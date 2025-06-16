import React, { useState, useEffect } from 'react';
import { Container, Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const PostListPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                // 调用后端 API 获取所有帖子
                const response = await fetch('/api/posts');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                setPosts(data.posts);
            } catch (error) {
                console.error("获取帖子列表失败:", error);
                setError("加载帖子失败，请稍后再试。");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    if (loading) {
        return <Container className="my-5 text-center"><p>加载中...</p></Container>;
    }

    if (error) {
        return <Container className="my-5 text-center text-danger"><p>{error}</p></Container>;
    }

    return (
        <Container className="my-5">
            <h2 className="h3 mb-4">📋 所有帖子</h2>
            <div>
                {posts.map((post, index) => (
                    <Card key={post.id} className="post-card mb-3 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center mb-2">
                                <span className="badge bg-primary">{post.forum?.name || '未知板块'}</span>
                                <small className="text-muted">{new Date(post.created_at).toLocaleDateString()}</small>
                            </div>
                            <h5 className="card-title">
                                <Link to={`/post/${post.id}`} className="text-decoration-none">
                                    {post.title}
                                </Link>
                            </h5>
                            <p className="card-text text-muted">
                                {post.content && post.content.length > 100 ? post.content.substring(0, 100) + '...' : (post.content || '暂无内容')}
                            </p>
                            <div className="d-flex gap-3">
                                <small className="text-muted">
                                    <i className="far fa-thumbs-up me-1"></i>{post.like_count || 0}
                                </small>
                                <small className="text-muted">
                                    <i className="far fa-comment me-1"></i>{post.comment_count || 0}
                                </small>
                                <small className="text-muted">
                                    <i className="far fa-eye me-1"></i>{post.view_count || 0}
                                </small>
                            </div>
                        </Card.Body>
                    </Card>
                ))}
            </div>
        </Container>
    );
};

export default PostListPage;