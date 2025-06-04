# bbs

## 项目修改记录
*2025.6.5.00点48分*
### 后端修改 (backend/)

- **用户模型增强 (`backend/app/models/user.py`):**
  - 添加了 `create_test_users` 类方法，用于创建测试用户数据，并正确地对密码进行哈希处理。

- **数据库初始化数据 (`backend/database/init_data.sql`):**
  - 移除了直接插入用户数据的 SQL 语句，改为通过代码（`create_test_users` 方法）创建用户，以确保密码正确哈希。
  - 保留了论坛、帖子、评论等其他初始数据的插入。
  - 添加了 `SET FOREIGN_KEY_CHECKS = 0;` 和 `SET FOREIGN_KEY_CHECKS = 1;` 来处理外键约束，但在后续的 `create_test_data.py` 脚本中通过调整创建顺序和提交时机更好地解决了外键问题。

- **应用初始化 (`backend/app/__init__.py`):**
  - 在应用上下文中添加了调用 `User.create_test_users()` 方法的代码，确保应用启动时创建测试用户。

- **测试数据初始化脚本 (`backend/database/create_test_data.py`):**
  - 创建了新的 Python 脚本 `create_test_data.py`，用于通过 SQLAlchemy ORM 创建测试用户、论坛、帖子和评论数据。
  - 调整了数据创建的顺序，先创建用户，然后创建论坛、帖子，最后创建评论，并在每一步创建完成后提交事务，以满足数据库外键约束。
  - 在脚本中添加了将项目根目录添加到 Python 路径的逻辑，解决了 `ModuleNotFoundError: No module named 'app'` 的问题。

- **API 接口增强 (`backend/app/api/posts.py`, `backend/app/api/forums.py`):**
  - 修改了 `GET /api/posts` 接口，增加了 `sort_by` 参数，支持按 `latest` (最新) 和 `popular` (点赞数) 排序。
  - 修改了 `GET /api/forums` 接口，增加了 `sort_by` 参数，支持按 `latest` (默认) 和 `popular` (帖子数量) 排序。

### 前端修改 (front/)

- **首页组件 (`front/src/pages/HomePage.js`):**
  - 移除了硬编码的静态热门帖子和板块数据。
  - 使用 `useEffect` 钩子在组件加载时调用后端 API (`/api/posts?sort_by=popular`, `/api/forums?sort_by=popular`) 获取动态数据。
  - 使用状态变量存储获取到的数据并在页面上展示。
  - 添加了加载中和错误提示状态。
  - 临时展示了帖子的作者 ID 和版块 ID，需要后端 API 返回更多信息以进行完整展示。

- **帖子列表页面 (`front/src/pages/PostListPage.js`):**
  - 新增 `PostListPage.js` 文件，用于展示所有帖子列表。
  - 该组件调用 `/api/posts` 接口获取所有帖子数据并进行基本展示。

- **前端路由配置 (`front/src/App.js`):**
  - 在前端路由中添加了 `/posts` 路径，将其映射到 `PostListPage` 组件。
  - 解决了点击首页"查看更多"按钮后页面空白的问题。

- **前端开发服务器代理 (`front/package.json`):**
  - 在 `package.json` 中添加了 `proxy` 配置，将所有 `/api` 开头的请求代理到后端服务器地址 (`http://127.0.0.1:8080`)。
  - 解决了前端无法正确访问后端 API 的问题。

## 如何运行项目

1.  **克隆项目:**
    ```bash
    git clone <仓库地址>
    cd bbs
    ```

2.  **后端设置:**
    - 进入 `backend` 目录: `cd backend`
    - 创建并激活 conda 虚拟环境: `conda create -n bbs python=3.10` (根据您的 Python 版本选择)
    - 激活环境: `conda activate bbs`
    - 安装依赖: `pip install -r requirements.txt`
    - 设置 MySQL 数据库，创建名为 `bbs_dev` 的数据库，并设置字符集为 `utf8mb4`。
    - 在 MySQL 命令行中执行初始化脚本:
      ```sql
      source F:/Vs_Code/bbs/backend/database/init.sql
      source F:/Vs_Code/bbs/backend/database/init_data.sql
      ```
    - 运行测试数据初始化脚本:
      ```bash
      python database/create_test_data.py
      ```
    - 运行后端服务器: `python run.py`

3.  **前端设置:**
    - 进入 `front` 目录: `cd ../front`
    - 安装依赖: `npm install` 或 `yarn install`
    - 运行前端开发服务器: `npm start` 或 `yarn start`


## 测试账号

- 管理员: 用户名 `admin`, 密码 `123456`
- 版主: 用户名 `moderator`, 密码 `123456`
- 普通用户: 用户名 `user1`, 密码 `123456`
