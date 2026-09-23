# MERN Project Console

一个基于 MERN 技术栈的项目管理示例应用，前端提供项目看板和表单管理，后端提供完整的项目 CRUD 接口与统计接口。项目默认支持两种数据模式：

- 配置 `MONGODB_URI` 时使用 MongoDB 持久化存储
- 未配置数据库时自动回退到内存数据，便于本地直接启动演示

## 项目介绍

当前项目是一个轻量级的项目资源管理后台，适合作为 MERN 全栈起步模板，也适合作为继续扩展用户、权限、任务、看板等业务模块的基础工程。

前端页面以英文文案展示项目列表、统计信息和新增编辑表单；后端提供与页面对应的健康检查、列表查询、统计汇总、创建、更新、删除接口，前后端已经打通，不再是占位示例。

## 功能模块

### 1. 前端模块

- 项目概览区：展示系统定位、服务运行状态、当前数据模式
- 统计卡片区：展示项目总数、已完成、进行中、待规划数量
- 项目表单区：支持新增项目、编辑项目、取消编辑
- 项目列表区：支持查看详情摘要、技术栈、仓库地址、演示地址
- 操作区：支持编辑和删除项目记录

### 2. 后端模块

- 服务健康检查：返回服务运行状态、当前数据模式、时间戳
- 项目列表接口：返回全部项目数据
- 项目统计接口：返回总数与状态分布
- 项目创建接口：校验必填字段后新增项目
- 项目更新接口：根据项目 ID 更新内容
- 项目删除接口：根据项目 ID 删除记录
- 数据存储层：优先使用 MongoDB，失败或未配置时自动切换到内存数据

## 页面说明

当前前端只有一个主页面，但页面内已经拆分为清晰的功能区域：

- `Hero` 区域：展示应用说明与后端运行状态
- `Summary` 区域：展示项目状态统计
- `Project Form` 区域：维护项目数据
- `Current Records` 区域：展示项目列表并提供编辑、删除操作

## 接口说明

接口基础前缀：`/api/v1`

### `GET /api/v1/health`

返回服务健康状态。

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
  "planned": 1
}
```

### `POST /api/v1/projects`

创建项目。

请求体示例：

```json
{
  "title": "Operations Dashboard",
  "category": "Full Stack",
  "status": "Planned",
  "summary": "A shared workspace for release visibility and delivery tracking.",
  "stack": ["React", "Express", "MongoDB"],
  "repoUrl": "https://github.com/example/project",
  "demoUrl": "https://example.com/demo"
}
```

### `PUT /api/v1/projects/:id`

更新指定项目。

### `DELETE /api/v1/projects/:id`

删除指定项目。

## 技术架构

### 前端

- React 18
- Create React App
- 原生 `fetch` 调用接口
- 纯 CSS 实现响应式页面

### 后端

- Node.js 18
- Express 4
- Mongoose 6
- CORS
- dotenv

### 数据层

- `config/database.js`：数据库连接与模式切换
- `models/projectModel.js`：MongoDB 项目模型
- `services/projectStore.js`：统一项目数据读写入口
- `data/defaultProjects.js`：默认演示数据

## 目录结构

```text
mernboilerplate-web
├── client
│   ├── public
│   └── src
│       ├── components
│       │   └── styles
│       ├── index.css
│       └── index.js
├── config
├── data
├── models
├── routes
│   └── api
├── services
├── .env.example
├── .gitignore
├── package.json
└── server.js
```

## 启动方式

### 1. 安装依赖

在项目根目录执行：

```bash
yarn install
```

或：

```bash
npm install
```

再安装前端依赖：

```bash
cd client && yarn install
```

或：

```bash
cd client && npm install
```

### 2. 配置环境变量

复制根目录 `.env.example` 为 `.env`，按需修改：

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/mern-project-console
```

如果不配置 `MONGODB_URI`，项目也可以启动，此时使用内存数据模式。

### 3. 启动后端

```bash
yarn dev
```

或：

```bash
npm run dev
```

后端默认运行在 `http://localhost:5000`

### 4. 启动前端

```bash
cd client && yarn start
```

或：

```bash
cd client && npm start
```

前端默认运行在 `http://localhost:3000`

### 5. 同时启动前后端

在项目根目录执行：

```bash
yarn mern
```

或：

```bash
npm run mern
```

## 可扩展方向

- 增加用户登录与权限控制
- 为项目增加负责人、优先级、截止日期等字段
- 接入分页、筛选、搜索能力
- 增加单元测试与接口测试
- 将项目模块扩展为任务管理或团队协作系统

## License

[MIT LICENSE](./LICENSE)
