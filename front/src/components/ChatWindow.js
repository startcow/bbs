import React, { useRef, useState } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ onClose, onMaximize }) => {
    const windowRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 100, y: 100 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [maximized, setMaximized] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [messages, setMessages] = useState({});
    const [newMessage, setNewMessage] = useState('');

    const mockMessages = {
        'user1': [
            { sender: 'user1', content: '你好，请问作业做完了吗？', timestamp: '24/6/13' },
            { sender: 'me', content: '还没呢，正在做。', timestamp: '24/6/13' }
        ],
        'user2': [
            { sender: 'user2', content: '今晚一起打球吗？🏀', timestamp: '24/6/12' },
            { sender: 'me', content: '好啊，几点？', timestamp: '24/6/12' }
        ]
    };

    const handleUserClick = (username) => {
        setSelectedUser(username);
        if (!messages[username]) {
            setMessages(prev => ({ ...prev, [username]: mockMessages[username] || [] }));
        }
    };

    const handleSendMessage = () => {
        if (!newMessage.trim() || !selectedUser) return;
        const newMsg = {
            sender: 'me',
            content: newMessage,
            timestamp: new Date().toLocaleDateString('zh-CN', { month: '2-digit', day: '2-digit', year: '2-digit' })
        };
        setMessages(prev => ({
            ...prev,
            [selectedUser]: [...(prev[selectedUser] || []), newMsg]
        }));
        setNewMessage('');
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
                        <input className="chat-search-input" placeholder="搜索" />
                        <button className="chat-search-btn">+</button>
                    </div>
                    <div className="chat-tabs">
                        <span className="chat-tab chat-tab-active">好友</span>
                        <span className="chat-tab">群聊</span>
                    </div>
                    <div className="chat-friends">
                        <div className="chat-friend-item" onClick={() => handleUserClick('user1')}>
                            <img className="chat-friend-avatar" src="https://i.imgtg.com/2023/05/19/ZQw6v.jpg" alt="f1" />
                            <div className="chat-friend-info">
                                <div className="chat-friend-name">user1 <span className="chat-verified">✔</span></div>
                                <div className="chat-friend-msg">你好，请问作业做完了吗？</div>
                            </div>
                            <div className="chat-friend-date">24/6/13</div>
                        </div>
                        <div className="chat-friend-item" onClick={() => handleUserClick('user2')}>
                            <img className="chat-friend-avatar" src="https://i.imgtg.com/2023/05/19/ZQw6v.jpg" alt="f2" />
                            <div className="chat-friend-info">
                                <div className="chat-friend-name">user2</div>
                                <div className="chat-friend-msg">今晚一起打球吗？🏀</div>
                            </div>
                            <div className="chat-friend-date">24/6/12</div>
                        </div>
                    </div>
                </div>
                <div className="chat-content">
                    {selectedUser ? (
                        <>
                            <div className="chat-messages" style={{ height: 'calc(100% - 60px)', overflowY: 'auto', padding: '10px' }}>
                                {messages[selectedUser]?.map((msg, index) => (
                                    <div key={index} style={{ marginBottom: '10px', textAlign: msg.sender === 'me' ? 'right' : 'left' }}>
                                        <div style={{ display: 'inline-block', padding: '8px 12px', borderRadius: '8px', background: msg.sender === 'me' ? '#1aad19' : '#f0f0f0', color: msg.sender === 'me' ? 'white' : 'black' }}>
                                            {msg.content}
                                        </div>
                                        <div style={{ fontSize: '12px', color: '#888', marginTop: '4px' }}>{msg.timestamp}</div>
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