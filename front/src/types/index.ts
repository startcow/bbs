export interface Forum {
  id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  posts: number;
  todayPosts: number;
  followers: number;
  moderators?: User[];
}

export interface Post {
  id: number;
  title: string;
  content: string;
  excerpt?: string;
  author: User;
  forum: Forum;
  createdAt: string;
  likes: number;
  views: number;
  comments: number;
  tags: string[];
  isLiked?: boolean;
  isFavorited?: boolean;
}

export interface User {
  id: number;
  username: string;
  email: string;
  avatar: string;
  role: string;
  permissions: string[];
  bio?: string;
  badges?: Badge[];
  managedForums?: number[];
}

export interface Badge {
  id: number;
  name: string;
  color: string;
}

export interface Comment {
  id: number;
  content: string;
  author: User;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}