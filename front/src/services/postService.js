const STORAGE_KEY = 'local_posts';

export const getLocalPosts = () => {
  const posts = localStorage.getItem(STORAGE_KEY);
  // console.log('获取本地帖子列表:', posts);
  return posts ? JSON.parse(posts) : [];
};

export const savePost = (postData) => {
  const posts = getLocalPosts();
  const newPost = {
    ...postData,
    id: Date.now(),  // 使用时间戳作为临时ID
    createdAt: new Date().toISOString(),
    likes: 0,
    views: 0,
    comments: 0,
    isLocal: true,  // 标记为本地帖子
  };
  
  posts.unshift(newPost);  // 添加到列表开头
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
  return newPost;
};

export const getPost = (postId) => {
  const posts = getLocalPosts();
  return posts.find(post => post.id === parseInt(postId));
};

export const updatePost = (postId, updateData) => {
  const posts = getLocalPosts();
  const index = posts.findIndex(post => post.id === parseInt(postId));
  if (index !== -1) {
    posts[index] = { ...posts[index], ...updateData };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
    return posts[index];
  }
  return null;
};

export const deletePost = (postId) => {
  const posts = getLocalPosts().filter(post => post.id !== parseInt(postId));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(posts));
};