export const forums = [
  {
    id: 1,
    name: "学术交流",
    description: "讨论学术问题，分享研究成果",
    icon: "fa-book",
    color: "primary",
    posts: 156,
    todayPosts: 12,
    followers: 328
  },
  {
    id: 2,
    name: "校园生活",
    description: "分享校园生活，交流日常趣事",
    icon: "fa-coffee",
    color: "success",
    posts: 243,
    todayPosts: 18,
    followers: 456
  }
];

export const mockUsers = [
  {
    id: 1,
    username: "admin",
    email: "admin@example.com",
    password: "123456",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
    role: "admin",
    permissions: ["forum:manage", "user:manage", "post:manage:all"],
    bio: "系统管理员",
    badges: [{ id: 1, name: "管理员", color: "danger" }]
  },
  {
    id: 2,
    username: "moderator",
    email: "mod@example.com",
    password: "123456",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=mod",
    role: "moderator",
    permissions: ["post:manage:forum", "comment:manage"],
    managedForums: [1],
    badges: [{ id: 2, name: "版主", color: "primary" }]
  }
];

export const moderators = mockUsers.filter(user => user.role === "moderator");

export const mockPosts = [
  {
    id: 1,
    title: "关于期末考试安排的通知",
    content: "各位同学：\n期末考试将于下周开始...",
    excerpt: "期末考试将于下周开始...",
    author: mockUsers[0],
    forum: forums[0],
    createdAt: "2024-01-15 14:30",
    likes: 45,
    views: 230,
    comments: 12,
    tags: ["通知", "考试"],
    isLiked: false,
    isFavorited: false
  }
];

export const comments = [
  {
    id: 1,
    content: "收到，谢谢通知！",
    author: mockUsers[1],
    createdAt: "2024-01-15 15:00",
    likes: 5,
    replies: []
  }
];