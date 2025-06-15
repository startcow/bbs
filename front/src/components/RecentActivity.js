import React, { useState } from 'react';
import { Carousel } from 'react-bootstrap';

// 活动图片和链接数据，每个图片可配置不同链接
const activities = [
    { img: '/activities/image1.jpg', link: 'https://mp.weixin.qq.com/s/4ZnPPLnQARsNmz9pgwWUOg' },
    { img: '/activities/image2.jpg', link: 'https://mp.weixin.qq.com/s/H-CSHC4BhXhAvtn8buiQng' },
    // 可继续添加更多活动
];

const RecentActivity = () => {
    // 当前图片索引
    const [index, setIndex] = useState(0);

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    return (
        <div>
            <Carousel activeIndex={index} onSelect={handleSelect} interval={3000}>
                {activities.map((item, idx) => (
                    <Carousel.Item key={idx}>
                        <img
                            src={item.img}
                            alt={`活动${idx + 1}`}
                            className="d-block w-100"
                            style={{ cursor: 'pointer', borderRadius: 8, maxHeight: 220, objectFit: 'cover' }}
                            onClick={() => window.open(item.link, '_blank')}
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
            {activities.length === 0 && (
                <div className="text-center py-3">暂无活动图片，请补全activities数组</div>
            )}
        </div>
    );
};

export default RecentActivity; 