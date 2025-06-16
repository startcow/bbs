import React, { useRef, useState, useEffect } from 'react';
import './ChatWindow.css';
import api from '../api';
import { useSelector } from 'react-redux';

const ChatWindow = ({ onClose, onMaximize }) => {
    const windowRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 100, y: 100 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [maximized, setMaximized] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [friendRequests, setFriendRequests] = useState([]);
    const [friends, setFriends] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sentRequests, setSentRequests] = useState([]);

    const currentUser = useSelector(state => state.auth.user);

    const PROCESSED_SENT_REQUESTS_KEY = 'processedSentRequests';

    const handleUserClick = (user) => {
        setSelectedUser(user);
        setMessages([]);
    };

    const handleSendMessage = async () => {
        if (!newMessage.trim() || !selectedUser) return;
        if (!currentUser) {
            alert('请先登录再发送消息！');
            return;
        }

        try {
            const response = await api.post('/messages', {
                receiver_id: selectedUser.id,
                content: newMessage
            });

            console.log('发送消息API响应:', response.data);

            setMessages(prev => [...prev, {
                id: response.data.id,
                sender_id: currentUser.id,
                receiver_id: selectedUser.id,
                content: newMessage,
                timestamp: new Date().toISOString(),
                is_read: false
            }]);
            setNewMessage('');
        } catch (error) {
            console.error('发送消息失败:', error);
            alert(error.response?.data?.error || '发送消息失败');
        }
    };

    const onMouseDown = (e) => {
        let node = e.target;
        let isHeader = false;
        while (node) {
            if (node.classList && node.classList.contains('chat-header')) {
                isHeader = true;
                break;
            }
            node = node.parentNode;
        }
        if (!isHeader || maximized) return;
        setDragging(true);
        setOffset({
            x: e.clientX - rel.x,
            y: e.clientY - rel.y
        });
        document.body.style.userSelect = 'none';
    };
    const onMouseMove = (e) => {
        if (!dragging || maximized) return;
        setRel({
            x: e.clientX - offset.x,
            y: e.clientY - offset.y
        });
    };
    const onMouseUp = () => {
        setDragging(false);
        document.body.style.userSelect = '';
    };

    React.useEffect(() => {
        if (dragging) {
            window.addEventListener('mousemove', onMouseMove);
            window.addEventListener('mouseup', onMouseUp);
        } else {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        }
        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
        };
    }, [dragging, maximized, offset.x, offset.y]);

    const handleMaximize = () => {
        setMaximized(v => !v);
        if (onMaximize) onMaximize();
    };
    const handleClose = () => {
        if (onClose) onClose();
    };

    const windowStyle = maximized
        ? { left: 0, top: 0, width: '100vw', height: '100vh', borderRadius: 0 }
        : { left: rel.x, top: rel.y };

    const handleSearch = async (e) => {
        const query = e.target.value;
        setSearchQuery(query);

        if (query.trim()) {
            try {
                const response = await api.get(`/users/search?query=${encodeURIComponent(query)}`);
                console.log('搜索用户API完整响应对象:', response);
                setSearchResults(response || []);
            } catch (error) {
                console.error('搜索用户失败:', error);
                setSearchResults([]);
            }
        } else {
            setSearchResults([]);
        }
    };

    const handleAddFriend = async (userId) => {
        try {
            await api.post('/friends/request', { receiver_id: userId });
            alert('好友申请已发送');
            await fetchSentFriendRequests();
        } catch (error) {
            alert(error.response?.data?.error || '发送好友申请失败');
        }
    };

    const handleFriendRequest = async (requestId, action) => {
        console.log(`handleFriendRequest 被调用 - request_id: ${requestId}, action: ${action}`);
        try {
            const response = await api.put(`/friends/request/${requestId}`, { action });
            console.log('处理好友申请API响应:', response);
            if (action === 'accept') {
                console.log('正在刷新接收方好友列表...');
                await fetchFriends();
                console.log('接收方好友列表刷新完成。');
            }
            console.log('正在刷新接收方好友申请列表...');
            await fetchFriendRequests();
            console.log('接收方好友申请列表刷新完成。');
            alert(action === 'accept' ? '已添加好友' : '已拒绝好友申请');
        } catch (error) {
            console.error('处理好友申请失败:', error);
            alert(error.response?.data?.error || '处理好友申请失败');
        }
    };

    const handleDeleteFriend = async (friendId) => {
        if (window.confirm('确定要删除此好友吗？')) {
            try {
                await api.delete(`/friends/${friendId}`);
                await fetchFriends();
                alert('好友已删除');
            } catch (error) {
                alert(error.response?.data?.error || '删除好友失败');
            }
        }
    };

    const fetchFriends = async () => {
        console.log('fetchFriends 被调用');
        try {
            setIsLoading(true);
            const response = await api.get('/friends');
            console.log('获取好友列表API响应:', response);
            setFriends(response || []);
            console.log('friends 状态已更新为:', response || []);
        } catch (error) {
            console.error('获取好友列表失败:', error);
            setFriends([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchFriendRequests = async () => {
        console.log('fetchFriendRequests 被调用');
        try {
            setIsLoading(true);
            const response = await api.get('/friends/requests');
            console.log('获取好友申请列表API响应:', response);
            setFriendRequests(response || []);
        } catch (error) {
            console.error('获取好友申请列表失败:', error);
            setFriendRequests([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchSentFriendRequests = async () => {
        try {
            const response = await api.get('/friends/sent_requests');
            const currentSentRequests = response || [];
            setSentRequests(currentSentRequests);

            const previouslyProcessedRequestIds = new Set(
                JSON.parse(localStorage.getItem(PROCESSED_SENT_REQUESTS_KEY) || '[]')
            );

            let newProcessedRequestIds = new Set(previouslyProcessedRequestIds);
            let shouldRefreshFriends = false;

            currentSentRequests.forEach(request => {
                if (!previouslyProcessedRequestIds.has(request.id)) {
                    if (request.status === 'rejected') {
                        alert(`您的好友请求已被 ${request.receiver.nickname || request.receiver.username} 拒绝.`);
                        newProcessedRequestIds.add(request.id);
                    } else if (request.status === 'accepted') {
                        shouldRefreshFriends = true;
                        newProcessedRequestIds.add(request.id);
                    }
                }
            });

            if (newProcessedRequestIds.size > previouslyProcessedRequestIds.size) {
                localStorage.setItem(PROCESSED_SENT_REQUESTS_KEY, JSON.stringify(Array.from(newProcessedRequestIds)));
            }

            if (shouldRefreshFriends) {
                console.log('检测到新接受的已发送请求，正在刷新发送方好友列表...');
                fetchFriends();
            }

        } catch (error) {
            console.error('获取已发送好友请求失败:', error);
            setSentRequests([]);
        }
    };

    const fetchMessages = async (userId) => {
        if (!userId) return;
        try {
            const response = await api.get(`/messages/${userId}`);
            console.log(`获取与用户 ${userId} 的聊天记录API响应:`, response);
            setMessages(response || []);
        } catch (error) {
            console.error('获取聊天记录失败:', error);
            setMessages([]);
        }
    };

    useEffect(() => {
        console.log('ChatWindow useEffect 触发');
        fetchFriends();
        fetchFriendRequests();
        fetchSentFriendRequests();

        const intervalId = setInterval(() => {
            fetchFriends();
            fetchFriendRequests();
            fetchSentFriendRequests();
            if (selectedUser) {
                fetchMessages(selectedUser.id);
            }
        }, 5000);

        return () => clearInterval(intervalId);

    }, [selectedUser]);

    useEffect(() => {
        if (selectedUser) {
            fetchMessages(selectedUser.id);
        } else {
            setMessages([]);
        }
    }, [selectedUser]);

    const displaySearchResults = Array.isArray(searchResults) ? searchResults : [];
    const displayFriendRequests = Array.isArray(friendRequests) ? friendRequests : [];

    console.log('ChatWindow组件渲染 - searchResults:', searchResults, 'length:', searchResults?.length);
    console.log('ChatWindow组件渲染 - displaySearchResults:', displaySearchResults, 'length:', displaySearchResults.length);
    console.log('ChatWindow组件渲染 - friendRequests:', friendRequests, 'length:', friendRequests?.length);
    console.log('ChatWindow组件渲染 - displayFriendRequests:', displayFriendRequests, 'length:', displayFriendRequests.length);

    return (
        <div
            ref={windowRef}
            className={`chat-window${maximized ? ' chat-window-max' : ''}`}
            style={windowStyle}
        >
            <div className="chat-header" onMouseDown={onMouseDown} style={{ cursor: 'move' }}>
                <span className="chat-logo">💬</span>
                <span className="chat-title">Chat</span>
                <div className="chat-header-btns">
                    <span className="chat-header-btn" title={maximized ? '还原' : '放大'} onClick={handleMaximize}>{maximized ? '🗗' : '□'}</span>
                    <span className="chat-header-btn" title="关闭" onClick={handleClose}>×</span>
                </div>
            </div>
            <div className="chat-body">
                <div className="chat-sidebar">
                    <div className="chat-profile">
                        <img className="chat-avatar" src="https://i.imgtg.com/2023/05/19/ZQw6v.jpg" alt="avatar" />
                        <div className="chat-username"> 是我啊 <span className="chat-verified">✔</span></div>
                    </div>
                    <div className="chat-search">
                        <input
                            className="chat-search-input"
                            placeholder="搜索用户..."
                            value={searchQuery}
                            onChange={handleSearch}
                        />
                    </div>
                    <div className="chat-tabs">
                        <span className="chat-tab chat-tab-active">好友</span>
                        <span className="chat-tab">群聊</span>
                    </div>
                    {displaySearchResults.length > 0 && (
                        <div className="search-results">
                            {displaySearchResults.map(user => (
                                <div key={user.id} className="search-result-item">
                                    <img src={user.avatar} alt={user.username} />
                                    <div className="search-result-info">
                                        <div className="search-result-name">{user.nickname || user.username}</div>
                                        <div className="search-result-username">{user.username}</div>
                                    </div>
                                    {friends && !friends.some(f => f.id === user.id) && (
                                        <button
                                            className="search-result-add"
                                            onClick={() => handleAddFriend(user.id)}
                                        >
                                            添加好友
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                    {displayFriendRequests.length > 0 && (
                        <div className="friend-requests">
                            <div className="friend-requests-title">好友申请</div>
                            {displayFriendRequests.map(request => (
                                <div key={request.id} className="friend-request-item">
                                    <img src={request.sender.avatar} alt={request.sender.username} />
                                    <div className="friend-request-info">
                                        <div className="friend-request-name">{request.sender.nickname || request.sender.username}</div>
                                        <div className="friend-request-username">{request.sender.username}</div>
                                    </div>
                                    <div className="friend-request-actions">
                                        <button
                                            className="friend-request-accept"
                                            onClick={() => handleFriendRequest(request.id, 'accept')}
                                        >
                                            同意
                                        </button>
                                        <button
                                            className="friend-request-reject"
                                            onClick={() => handleFriendRequest(request.id, 'reject')}
                                        >
                                            拒绝
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="chat-friends">
                        {isLoading ? (
                            <div className="chat-loading">加载中...</div>
                        ) : friends && friends.length > 0 ? (
                            friends.map(friend => (
                                <div
                                    key={friend.id}
                                    className={`chat-friend-item ${selectedUser && selectedUser.id === friend.id ? 'chat-friend-item-active' : ''}`}
                                    onClick={() => handleUserClick(friend)}
                                >
                                    <img className="chat-friend-avatar" src={friend.avatar} alt={friend.username} />
                                    <div className="chat-friend-info">
                                        <div className="chat-friend-name">{friend.nickname || friend.username}</div>
                                        <div className="chat-friend-msg">点击开始聊天</div>
                                    </div>
                                    <button
                                        className="chat-friend-delete"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleDeleteFriend(friend.id);
                                        }}
                                    >
                                        删除
                                    </button>
                                </div>
                            ))
                        ) : (
                            <div className="chat-no-friends">暂无好友</div>
                        )}
                    </div>
                </div>
                <div className="chat-content">
                    {selectedUser ? (
                        <>
                            <div className="chat-messages" style={{ height: 'calc(100% - 60px)', overflowY: 'auto', padding: '10px' }}>
                                {messages.map((msg, index) => (
                                    <div
                                        key={msg.id || index}
                                        style={{
                                            marginBottom: '10px',
                                            textAlign: msg.sender_id === currentUser.id ? 'right' : 'left'
                                        }}
                                    >
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '8px 12px',
                                            borderRadius: '8px',
                                            background: msg.sender_id === currentUser.id ? '#1aad19' : '#f0f0f0',
                                            color: msg.sender_id === currentUser.id ? 'white' : 'black'
                                        }}>
                                            {msg.content}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>
                                            {new Date(msg.timestamp + 'Z').toLocaleString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div style={{ display: 'flex', padding: '10px', borderTop: '1px solid #eee' }}>
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="输入消息..."
                                    style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ddd', marginRight: '10px' }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') {
                                            handleSendMessage();
                                        }
                                    }}
                                />
                                <button onClick={handleSendMessage} style={{ padding: '8px 16px', background: '#1aad19', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>发送</button>
                            </div>
                        </>
                    ) : (
                        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%', color: '#888' }}>请选择一个用户开始聊天</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow; 