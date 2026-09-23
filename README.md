# MERN Project Console

一个前后端分离的现代 MERN 全栈项目模板，前端位于 `client`，后端位于 `server`。项目围绕“项目管理控制台”场景实现，包含完整的页面、路由、接口、数据存储、表单维护与状态统计能力，适合作为全栈后台项目的起步工程。

## 项目概览

当前项目采用最新一代的常用技术栈与更规范的工程布局：

- 前端：React 19 + Vite 8 + React Router 7 + Material UI 9
- 后端：Node.js + Express 5 + Mongoose 9 + Zod 4
- 架构：前后端完全分离，根目录统一管理工作区脚本
- 数据模式：
  - 配置 `MONGODB_URI` 时使用 MongoDB 持久化存储
  - 未配置数据库时自动回退到内存数据，便于本地直接运行

## 主要功能

### 前端页面功能

- 首页概览页
  - 展示系统定位、运行状态、架构说明
  - 展示项目总数、已完成、进行中、待规划统计
  - 展示最近项目记录预览
- 项目管理页
  - 支持项目列表展示
  - 支持关键字筛选
  - 支持状态筛选
  - 支持新增项目
  - 支持编辑项目
  - 支持删除项目
  - 支持查看技术栈、仓库地址、演示地址

### 后端接口功能

- 健康检查接口
- 项目列表接口
- 项目统计接口
- 项目创建接口
- 项目更新接口
- 项目删除接口
- 请求校验、中间件、错误处理、数据模式切换

## 技术架构

### 根目录

根目录只负责项目级配置与工作区命令：

- 统一依赖安装
- 同时启动前后端
- 统一构建
- 环境变量示例与忽略规则维护

### 前端架构

前端所有代码都在 `client`，并按职责拆分：

- `src/app`：应用入口、Provider、上下文辅助
- `src/router`：路由定义
- `src/layouts`：布局层
- `src/pages`：页面层
- `src/components`：组件层
- `src/hooks`：状态与数据逻辑
- `src/services`：接口请求封装
- `src/utils`：表单与业务辅助方法
- `src/styles`：主题与全局样式

前端统一使用 `@/` 作为 `src` 路径别名。

### 后端架构

后端所有代码都在 `server`，并按现代分层结构组织：

- `src/config`：环境变量、数据库、CORS 配置
- `src/controllers`：控制器
- `src/middleware`：中间件
- `src/models`：Mongoose 模型
- `src/routes`：路由定义
- `src/services`：数据服务层
- `src/validators`：请求参数校验
- `src/utils`：工具函数
- `src/data`：默认演示数据

## 目录结构

```text
mernboilerplate-web
├── client
│   ├── public
│   ├── src
│   │   ├── app
│   │   ├── components
│   │   ├── hooks
│   │   ├── layouts
│   │   ├── pages
│   │   ├── router
│   │   ├── services
│   │   ├── styles
│   │   └── utils
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

## 页面说明

### `/`

首页概览页，主要展示：

- 当前项目定位
- 服务运行状态
- 数据模式
- 项目统计数据
- 最近项目记录
- 前后端架构说明

### `/projects`

项目管理页，主要提供：

- 项目筛选
- 项目卡片列表
- 新增项目弹窗
- 编辑项目弹窗
- 删除项目操作
- 创建、更新、删除后的反馈提示

## 接口说明

接口基础前缀：`/api/v1`

### `GET /api/v1/health`

返回服务状态与数据模式。

示例响应：

```json
{
  "message": "Service is running.",
  "mode": "memory",
  "timestamp": "2026-09-23T00:00:00.000Z"
}
```

### `GET /api/v1/projects`

返回项目列表。

### `GET /api/v1/projects/summary`

返回项目统计摘要。

示例响应：

```json
{
  "total": 3,
  "completed": 1,
  "inProgress": 1,
  "planned": 1,
  "mode": "memory"
}
```

### `POST /api/v1/projects`

创建项目。

请求体示例：

```json
{
  "title": "Delivery Command Center",
  "category": "Full Stack",
  "status": "Planned",
  "summary": "A shared control surface for portfolio tracking and release planning.",
  "stack": ["React 19", "Vite 8", "Express 5"],
  "repoUrl": "https://github.com/example/project",
  "demoUrl": "https://example.com/demo"
}
```

### `PUT /api/v1/projects/:projectId`

更新项目。

### `DELETE /api/v1/projects/:projectId`

删除项目。

## 启动方式

### 1. 安装依赖

在项目根目录执行：

```bash
npm install
```

### 2. 配置环境变量

在根目录创建 `.env`，可参考 `.env.example`：

```env
CLIENT_PORT=5173
SERVER_PORT=5051
CLIENT_ORIGIN=http://localhost:5173
VITE_API_BASE_URL=http://localhost:5051/api/v1
MONGODB_URI=mongodb://127.0.0.1:27017/mern-project-console
```

说明：

- `CLIENT_PORT`：前端开发端口
- `SERVER_PORT`：后端服务端口
- `CLIENT_ORIGIN`：后端允许访问的前端地址
- `VITE_API_BASE_URL`：前端接口基础地址
- `MONGODB_URI`：MongoDB 连接地址

### 3. 同时启动前后端

```bash
npm run dev
```

默认访问地址：

- 前端：`http://localhost:5173`
- 后端：`http://localhost:5051`

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

其中：

- `client` 执行 Vite 生产构建
- `server` 执行语法与结构检查

## 当前项目特点

- 已完成前后端分离
- 已升级到更新的主流版本栈
- 已补齐前后端完整 CRUD 流程
- 已将前端按路由、页面、组件、方法、服务拆分
- 已将后端按配置、控制器、中间件、模型、路由、校验、服务拆分
- 已移除旧版 CRA 与旧版根级后端结构中的无用文件
- 已保留 MongoDB 模式与无数据库可运行的回退模式

## License

[MIT LICENSE](./LICENSE)
