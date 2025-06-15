import React, { useRef, useState } from 'react';
import './ChatWindow.css';

const ChatWindow = ({ onClose, onMaximize }) => {
    const windowRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [rel, setRel] = useState({ x: 100, y: 100 });
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    const [maximized, setMaximized] = useState(false);

    // 拖动事件
    const onMouseDown = (e) => {
        // 只允许在顶部栏（chat-header）拖动
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

    // 放大/还原
    const handleMaximize = () => {
        setMaximized(v => !v);
        if (onMaximize) onMaximize();
    };
    // 关闭
    const handleClose = () => {
        if (onClose) onClose();
    };

    // 样式
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
                        <div className="chat-friend-item">
                            <img className="chat-friend-avatar" src="https://i.imgtg.com/2023/05/19/ZQw6v.jpg" alt="f1" />
                            <div className="chat-friend-info">
                                <div className="chat-friend-name">user1 <span className="chat-verified">✔</span></div>
                                <div className="chat-friend-msg">你好，请问作业做完了吗？</div>
                            </div>
                            <div className="chat-friend-date">24/6/13</div>
                        </div>
                        <div className="chat-friend-item">
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
                    {/* 右侧聊天内容区，暂不实现 */}
                </div>
            </div>
        </div>
    );
};

export default ChatWindow; 