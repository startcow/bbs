// 统一的存储管理工具类
class Storage {
  // 存储到 localStorage
  setItem(key, value) {
    if (typeof value === 'object') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      localStorage.setItem(key, value);
    }
  }

  // 从 localStorage 获取
  getItem(key) {
    const value = localStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }

  // 从 localStorage 删除
  removeItem(key) {
    localStorage.removeItem(key);
  }

  // 清除所有数据
  clear() {
    localStorage.clear();
  }

  // 存储到 sessionStorage
  setSessionItem(key, value) {
    if (typeof value === 'object') {
      sessionStorage.setItem(key, JSON.stringify(value));
    } else {
      sessionStorage.setItem(key, value);
    }
  }

  // 从 sessionStorage 获取
  getSessionItem(key) {
    const value = sessionStorage.getItem(key);
    try {
      return JSON.parse(value);
    } catch {
      return value;
    }
  }
}

export default new Storage();