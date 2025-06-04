// 获取本地存储数据的key
const STORAGE_KEYS = {
  POSTS: 'local_posts',
  COMMENTS: 'local_comments',
  DRAFTS: 'post_drafts'
};

// 获取本地帖子列表
export const getLocalPosts = () => {
  const posts = localStorage.getItem(STORAGE_KEYS.POSTS);
  return posts ? JSON.parse(posts) : [];
};

// 保存帖子到本地
export const saveLocalPost = (post) => {
  const posts = getLocalPosts();
  const newPost = {
    ...post,
    id: Date.now(), // 使用时间戳作为临时ID
    createdAt: new Date().toISOString(),
    likes: 0,
    views: 0,
    comments: 0,
    isLocal: true // 标记为本地帖子
  };
  
  posts.unshift(newPost);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
  return newPost;
};

// 保存草稿
export const savePostDraft = (draft) => {
  const drafts = getPostDrafts();
  const newDraft = {
    ...draft,
    id: Date.now(),
    lastModified: new Date().toISOString()
  };
  
  drafts.unshift(newDraft);
  localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
  return newDraft;
};

// 获取草稿列表
export const getPostDrafts = () => {
  const drafts = localStorage.getItem(STORAGE_KEYS.DRAFTS);
  return drafts ? JSON.parse(drafts) : [];
};

// 删除草稿
export const deletePostDraft = (draftId) => {
  const drafts = getPostDrafts().filter(draft => draft.id !== draftId);
  localStorage.setItem(STORAGE_KEYS.DRAFTS, JSON.stringify(drafts));
};

// 删除本地帖子
export const deleteLocalPost = (postId) => {
  const posts = getLocalPosts().filter(post => post.id !== postId);
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
};

// 更新本地帖子
export const updateLocalPost = (postId, updatedData) => {
  const posts = getLocalPosts().map(post => 
    post.id === postId ? { ...post, ...updatedData } : post
  );
  localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
};