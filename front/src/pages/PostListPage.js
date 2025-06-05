import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
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
            <h2>所有帖子</h2>
            <Row>
                {posts.map(post => (
                    <Col key={post.id} md={6} className="mb-4">
                        <Card>
                            <Card.Body>
                                <Badge bg="secondary">版块ID: {post.forum_id}</Badge>
                                <Card.Title as="h5" className="mt-2">
                                    <Link to={`/post/${post.id}`} className="text-decoration-none text-dark">
                                        {post.title}
                                    </Link>
                                </Card.Title>
                                <Card.Text>
                                    {/* 这里可以截取部分内容 */}
                                    {post.content.substring(0, 100)}...
                                </Card.Text>
                                <div>
                                    <small className="text-muted">作者ID: {post.user_id} | 👍 {post.like_count} | 💬 {post.comment_count}</small>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default PostListPage; 