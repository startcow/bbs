import api from './index';

export const search = (keyword) => {
  return api.get('/search', {
    params: {
      keyword,
    }
  });
};
