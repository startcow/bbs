import api from './index';

// 获取最新通知
export const getNotices = () => {
  return api.get('/spider/notices');
};