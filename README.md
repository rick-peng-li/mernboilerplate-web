<!-- Git Repository: git@github.com:rick-peng-li/mernboilerplate-web.git -->

# MERN Project Console

一个前后端分离的现代 MERN 协作平台项目。前端位于 `client`，后端位于 `server`，围绕项目组合管理、任务执行、团队协作、版本发布、活动追踪、数据分析和系统配置等场景构建，已经具备完整的前后端联动能力。

## 项目定位

当前项目不是简单的模板页，而是一个多模块联动的项目协作控制台，适合作为以下类型项目的基础工程：

- 项目管理后台
- 团队协作平台
- 任务与版本跟踪系统
- 中后台运营看板
- 全栈 MERN 架构示例工程

## 应用技术

### 前端技术

- React 19
- Vite 8
- React Router 7
- Material UI 9
- Axios

### 后端技术

- Node.js
- Express 5
- Mongoose 9
- Zod 4
- Morgan
- CORS

### 工程能力

- 前后端完全分离
- `@/` 路径别名
- 根目录统一工作区脚本
- 基于 token 的登录鉴权与受保护路由
- 支持 MongoDB 持久化模式
- 未配置数据库时自动回退内存数据模式

## 架构说明

### 整体架构

- 根目录负责工作区依赖、统一脚本、环境变量和项目文档
- `client` 负责前端页面、路由、组件、状态和接口调用
- `server` 负责接口服务、控制器、中间件、模型、校验和聚合数据服务

### 前端架构

前端核心目录如下：

- `src/app`
  - 应用入口
  - Theme 与 Auth Provider 装配
  - 路由上下文访问
- `src/pages`
  - 页面文件目录
  - 包含登录、注册和工作台业务页面
- `src/router.js`
  - 前端路由统一入口
- `src/components`
  - 组件按业务模块拆分
  - 包含认证、项目、任务、团队、版本、活动、设置、公共组件
- `src/hooks`
  - 页面数据加载与项目工作台加载逻辑
- `src/services`
  - 与后端接口通信的方法封装
- `src/utils`
  - 表单模型、格式化方法、状态选项等公共方法
- `src/styles`
  - 主题与全局样式

### 后端架构

后端核心目录如下：

- `src/config`
  - 环境变量
  - CORS
  - 数据库连接
- `src/controllers`
  - 各业务模块控制器
- `src/routes`
  - 路由定义
- `src/models`
  - 用户、项目、任务、成员、版本、活动、设置模型
- `src/services`
  - 工作区聚合数据服务
  - 认证服务
  - CRUD 与统计逻辑
  - 活动流写入逻辑
- `src/validators`
  - 请求参数校验
- `src/middleware`
  - 错误处理、404、请求校验中间件
- `src/data`
  - 默认演示数据
- `src/utils`
  - 异步处理辅助函数

## 模块与页面功能

当前前端已包含 10 个以上页面模块，且互相关联。

### 1. 登录页 `/login`

功能：

- 使用账号密码登录
- 登录成功后写入 token
- 自动跳转到受保护工作台
- 展示演示账号信息

依赖关系：

- 依赖认证接口
- 登录成功后驱动所有工作区接口访问

### 2. 注册页 `/register`

功能：

- 创建新账号
- 选择角色
- 注册成功后自动进入工作台

依赖关系：

- 依赖认证接口
- 注册成功后自动建立当前登录态
### 3. 概览页 `/`

功能：

- 展示系统概览和运行模式
- 展示项目总量、活跃项目、任务数量、成员数量、待发布版本数量
- 展示项目聚焦卡片
- 展示高优先级任务
- 展示近期活动流
- 展示待发布版本信息

依赖关系：

- 依赖 Dashboard 聚合接口
- 同时汇总项目、任务、成员、版本、活动、设置数据

### 4. 项目页 `/projects`

功能：

- 项目列表展示
- 关键字搜索
- 按状态筛选
- 按优先级筛选
- 按分类筛选
- 新增项目
- 编辑项目
- 删除项目
- 跳转项目工作台详情页

依赖关系：

- 项目归属成员来自团队模块
- 项目成员来自团队模块
- 项目详情页关联任务、版本、活动

### 5. 项目工作台页 `/projects/:projectId`

功能：

- 查看项目完整详情
- 查看项目 owner
- 查看项目成员
- 查看项目任务
- 查看项目版本
- 查看项目活动流
- 查看项目进度、健康状态、优先级、交付日期

依赖关系：

- 关联项目模块
- 关联任务模块
- 关联团队模块
- 关联版本模块
- 关联活动模块

### 6. 任务页 `/tasks`

功能：

- 任务列表
- 按状态筛选
- 按项目筛选
- 按成员筛选
- 搜索任务
- 新增任务
- 编辑任务
- 删除任务
- 任务绑定项目
- 任务绑定负责人
- 任务绑定版本

依赖关系：

- 项目来源于项目模块
- 负责人来源于团队模块
- 版本来源于版本模块
- 新增与更新任务会写入活动中心

### 7. 团队页 `/team`

功能：

- 团队成员列表
- 按姓名、角色、技能搜索
- 新增成员
- 编辑成员
- 删除成员
- 维护成员技能、地点、时区、负载、容量、状态

依赖关系：

- 项目 owner 和项目成员使用团队数据
- 任务负责人使用团队数据
- 版本 owner 使用团队数据

### 8. 版本页 `/releases`

功能：

- 版本列表展示
- 新增版本
- 编辑版本
- 删除版本
- 维护版本号、版本名称、状态、发布时间
- 绑定多个项目
- 绑定多个任务
- 绑定版本 owner

依赖关系：

- 版本可关联多个项目
- 版本可关联多个任务
- 版本变更会写入活动流

### 9. 活动页 `/activity`

功能：

- 查看活动时间流
- 按活动类型筛选
- 按项目筛选
- 展示发起人、活动内容、时间、级别

依赖关系：

- 来自项目、任务、团队、版本、设置的变更行为
- 所有增删改动作都会驱动活动流变化

### 10. 分析页 `/analytics`

功能：

- 展示平均项目进度
- 展示健康项目数量
- 展示风险项目数量
- 展示成员负载占用
- 展示任务优先级分布
- 展示项目健康矩阵
- 展示版本日历

依赖关系：

- 聚合项目、任务、成员、版本数据
- 不依赖单页本地计算，使用后端分析接口返回

### 11. 设置页 `/settings`

功能：

- 修改工作区名称
- 修改默认首页
- 修改时区
- 修改每日摘要时间
- 修改版本发布窗口
- 控制邮件、Slack、浏览器通知开关

依赖关系：

- 设置会影响概览信息和工作区默认行为
- 设置更新会记录到活动中心

## 后端接口设计

接口基础前缀：`/api/v1`

### 健康与概览

- `GET /api/v1/health`
  - 服务状态
  - 当前数据模式
  - 时间戳

### 认证模块

- `POST /api/v1/auth/register`
  - 注册账号
  - 返回 token 和当前用户
- `POST /api/v1/auth/login`
  - 登录账号
  - 返回 token 和当前用户
- `GET /api/v1/auth/me`
  - 获取当前登录用户
- `POST /api/v1/auth/logout`
  - 退出当前会话

- `GET /api/v1/dashboard/overview`
  - 首页聚合数据
  - 项目统计
  - 活动流摘要
  - 待发布版本
  - 高优任务
  - 成员容量

### 项目模块

- `GET /api/v1/projects`
  - 项目列表
- `GET /api/v1/projects/:projectId`
  - 单项目工作台详情
  - 返回项目、成员、任务、版本、活动
- `POST /api/v1/projects`
  - 创建项目
- `PUT /api/v1/projects/:projectId`
  - 更新项目
- `DELETE /api/v1/projects/:projectId`
  - 删除项目

### 任务模块

- `GET /api/v1/tasks`
  - 任务列表
  - 支持 `projectId`、`assigneeId`、`status` 过滤
- `POST /api/v1/tasks`
  - 创建任务
- `PUT /api/v1/tasks/:taskId`
  - 更新任务
- `DELETE /api/v1/tasks/:taskId`
  - 删除任务

### 团队模块

- `GET /api/v1/team`
  - 团队成员列表
- `POST /api/v1/team`
  - 创建成员
- `PUT /api/v1/team/:memberId`
  - 更新成员
- `DELETE /api/v1/team/:memberId`
  - 删除成员

### 版本模块

- `GET /api/v1/releases`
  - 版本列表
  - 支持 `projectId`、`status` 过滤
- `POST /api/v1/releases`
  - 创建版本
- `PUT /api/v1/releases/:releaseId`
  - 更新版本
- `DELETE /api/v1/releases/:releaseId`
  - 删除版本

### 活动模块

- `GET /api/v1/activities`
  - 活动列表
  - 支持 `projectId`、`type` 过滤

### 分析模块

- `GET /api/v1/analytics`
  - 工作区统计分析
  - 返回项目健康、任务优先级、成员负载、版本日历等

### 设置模块

- `GET /api/v1/settings`
  - 获取工作区设置
- `PUT /api/v1/settings`
  - 更新工作区设置

## 数据实体

当前项目已包含以下后端实体：

- User
- Project
- Task
- Member
- Release
- Activity
- Setting

这些实体之间具备明确的关联关系：

- Project 关联多个 Member
- Project 关联多个 Task
- Project 关联多个 Release
- Task 关联一个 Project
- Task 关联一个 Assignee
- Task 可关联一个 Release
- Release 可关联多个 Project
- Release 可关联多个 Task
- Activity 记录来自多个模块的变更事件
- Setting 影响工作区运行配置

## 目录结构

```text
mernboilerplate-web
├── client
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   │   ├── activity
│   │   │   ├── auth
│   │   │   ├── common
│   │   │   ├── projects
│   │   │   ├── releases
│   │   │   ├── settings
│   │   │   ├── tasks
│   │   │   └── team
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── services
│   │   ├── styles
│   │   ├── utils
│   │   └── router.js
│   ├── index.html
│   ├── jsconfig.json
│   ├── package.json
│   └── vite.config.js
├── server
│   ├── src
│   │   ├── config
│   │   ├── controllers
│   │   ├── data
│   │   ├── middleware
│   │   ├── models
│   │   ├── routes
│   │   ├── services
│   │   ├── utils
│   │   └── validators
│   └── package.json
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 启动方式

### 1. 安装依赖

```bash
npm install
```

### 2. 配置环境变量

根目录创建 `.env`，参考 `.env.example`：

```env
CLIENT_PORT=5173
SERVER_PORT=5051
CLIENT_ORIGIN=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5051/api/v1
MONGODB_URI=mongodb://127.0.0.1:27017/mern-project-console
AUTH_SECRET=change-this-to-a-secure-random-value
```

### 3. 同时启动前后端

```bash
npm run dev
```

默认地址：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:5051`

演示账号：

- `admin@mernconsole.dev / Admin@123456`
- `manager@mernconsole.dev / Manager@123456`

### 4. 单独启动前端

```bash
npm run client
```

### 5. 单独启动后端

```bash
npm run server
```

### 6. 构建项目

```bash
npm run build
```

## 当前项目特点

- 已完成前后端分离
- 已补充 8 个以上页面功能模块
- 已补充完整的项目、任务、成员、版本、活动、设置、分析接口
- 已补充登录、注册、当前用户和退出接口
- 前端页面、路由、组件、方法已拆分
- 前端路由统一放在 `src/router.js`
- 前端页面统一放在 `src/pages`
- 后端采用 `config / controllers / middleware / models / routes / services / validators`
- 已删除旧 `router` 目录和不再使用的旧工具文件
- 已保持页面业务文案为英文，README 说明为中文

## License

[MIT LICENSE](./LICENSE)
