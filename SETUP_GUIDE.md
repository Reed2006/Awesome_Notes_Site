# EconAI 文件下载功能配置指南

## 第一步：配置 Supabase

### 1.1 创建 Supabase 账号和项目

1. **访问 Supabase 官网**
   - 打开浏览器访问：https://supabase.com
   - 点击右上角 "Start your project" 或 "Sign in"

2. **注册/登录**
   - 使用 GitHub 账号登录（推荐）
   - 或使用邮箱注册

3. **创建新项目**
   - 登录后，点击 "New Project"
   - 填写项目信息：
     - **Name**：econai（或任意名称）
     - **Database Password**：设置一个强密码（请记住）
     - **Region**：选择离你最近的区域（如 Northeast Asia (Tokyo) 或 Southeast Asia (Singapore)）
     - **Pricing Plan**：选择 "Free"（免费版足够使用）
   - 点击 "Create new project"
   - 等待 1-2 分钟，项目创建完成

### 1.2 创建 Storage Bucket

1. **进入 Storage 页面**
   - 在左侧菜单中点击 "Storage"
   - 点击 "Create a new bucket"

2. **配置 Bucket**
   - **Name**：输入 `course-resources`（必须是这个名称）
   - **Public bucket**：✅ **勾选此选项**（允许公开访问）
   - **File size limit**：保持默认（50MB）或改为 100MB
   - **Allowed MIME types**：留空（允许所有类型）
   - 点击 "Create bucket"

### 1.3 配置存储策略（RLS Policies）

1. **进入 Policies 设置**
   - 在 Storage 页面，点击刚创建的 `course-resources` bucket
   - 点击 "Policies" 标签
   - 点击 "New Policy"

2. **创建读取策略（允许下载）**
   - 点击 "For full customization"
   - 配置如下：
     ```
     Policy name: Public Access
     Allowed operation: SELECT
     ```
   - 在 "Policy definition" 输入框中输入：
     ```sql
     bucket_id = 'course-resources'
     ```
   - 点击 "Review"，然后点击 "Save policy"

3. **创建上传策略（允许上传）**
   - 再次点击 "New Policy"
   - 点击 "For full customization"
   - 配置如下：
     ```
     Policy name: Public Upload
     Allowed operation: INSERT
     ```
   - 在 "Policy definition" 输入框中输入：
     ```sql
     bucket_id = 'course-resources'
     ```
   - 点击 "Review"，然后点击 "Save policy"

### 1.4 获取 API 密钥

1. **进入 Project Settings**
   - 点击左侧菜单底部的齿轮图标 ⚙️（Settings）
   - 点击 "API"

2. **复制必要信息**
   - **Project URL**：找到 "Project URL"，复制整个 URL
     ```
     示例：https://abcdefghijklmnop.supabase.co
     ```
   - **API Key (anon public)**：找到 "anon" "public" 标签下的密钥，点击复制
     ```
     示例：eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.ey...（很长的字符串）
     ```

---

## 第二步：配置本地环境

### 2.1 更新 .env 文件

1. **打开项目文件夹**
   - 在终端中进入项目目录：
     ```bash
     cd /Users/air/Downloads/econai
     ```

2. **编辑 .env 文件**
   - 使用任意文本编辑器打开 `.env` 文件
   - 替换为你的 Supabase 信息：
     ```env
     VITE_SUPABASE_URL=https://你的项目ID.supabase.co
     VITE_SUPABASE_ANON_KEY=你的anon密钥
     ```
   - **示例**：
     ```env
     VITE_SUPABASE_URL=https://abcdefghijklmnop.supabase.co
     VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFiY2RlZmdoaWprbG1ub3AiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMzA4MTU5MCwiZXhwIjoxOTM4NjU3NTkwfQ.xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
     ```
   - 保存文件

### 2.2 安装依赖并启动开发服务器

1. **安装项目依赖**（如果还没安装）
   ```bash
   pnpm install
   ```

   如果没有安装 pnpm，先安装：
   ```bash
   npm install -g pnpm
   ```

2. **启动开发服务器**
   ```bash
   pnpm dev
   ```

3. **查看启动信息**
   - 终端会显示类似信息：
     ```
     VITE v5.3.1  ready in 500 ms

     ➜  Local:   http://localhost:5173/
     ➜  Network: use --host to expose
     ➜  press h to show help
     ```

4. **打开浏览器**
   - 在浏览器中访问：http://localhost:5173
   - 你应该能看到 EconAI 的主页

---

## 第三步：测试文件上传和下载

### 3.1 测试文件上传

1. **访问上传管理页面**
   - 在浏览器中访问：http://localhost:5173/admin/upload
   - 你会看到按分类组织的所有课程

2. **选择一个课程上传文件**
   - 点击任意课程卡片上的 "上传文件" 按钮
   - 在弹出的对话框中，点击 "选择文件"
   - 选择一个测试文件（PDF、视频、压缩包等，最大 100MB）
   - 查看文件信息预览
   - 点击 "上传" 按钮

3. **观察上传过程**
   - 进度条会实时显示上传进度
   - 上传成功后会显示 Toast 提示 "文件已上传: xxx"
   - 查看浏览器控制台（F12），会输出上传结果：
     ```javascript
     文件上传成功: {
       url: "https://xxx.supabase.co/storage/v1/object/public/course-resources/...",
       filename: "test.pdf",
       size: 123456,
       type: "application/pdf"
     }
     ```

4. **验证文件已上传到 Supabase**
   - 返回 Supabase Dashboard
   - 进入 Storage > course-resources
   - 你应该能看到刚上传的文件，文件路径类似：`econ/political-economy/test.pdf`

### 3.2 测试文件下载（手动添加下载链接）

由于当前数据是硬编码的，我们需要手动添加下载链接来测试下载功能：

1. **获取上传文件的公开 URL**
   - 在 Supabase Dashboard 的 Storage 页面
   - 找到刚上传的文件
   - 点击文件右侧的 "..." 菜单
   - 点击 "Get public URL"
   - 复制 URL（类似：`https://xxx.supabase.co/storage/v1/object/public/course-resources/econ/political-economy/test.pdf`）

2. **修改 courseData.ts 添加下载链接**
   - 打开 `src/lib/courseData.ts`
   - 找到对应的课程资源
   - 添加 `downloadUrl` 等字段：
     ```typescript
     resources: [
       {
         id: 'pe-1',
         title: '马克思《资本论》导读',
         type: 'PDF',
         description: '第一卷核心章节注释版',
         // 添加这些字段
         downloadUrl: '你复制的公开URL',
         fileSize: 2548736,  // 文件大小（字节）
         mimeType: 'application/pdf',
         uploadedAt: '2025-12-22T10:30:00Z',
       },
       // ...
     ]
     ```
   - 保存文件，Vite 会自动热重载

3. **测试下载功能**
   - 回到主页：http://localhost:5173
   - 从左侧菜单选择对应的课程
   - 你会看到资源卡片上显示了文件信息（大小、类型、上传时间）
   - 将鼠标悬停在资源卡片上，下载按钮会展开显示 "下载"
   - 点击下载按钮
   - 观察下载进度条（如果文件较大）
   - 文件会自动下载到浏览器的默认下载文件夹
   - 下载完成后会显示 Toast 提示 "文件已下载: xxx"

---

## 第四步：验证功能（可选）

### 4.1 测试错误处理

1. **测试文件过大**
   - 尝试上传超过 100MB 的文件
   - 应该显示错误提示："文件大小不能超过 100MB"

2. **测试不支持的文件类型**
   - 尝试上传 .exe 或其他不支持的文件
   - 应该显示错误提示："不支持的文件类型"

3. **测试没有下载链接**
   - 点击没有 `downloadUrl` 的资源
   - 应该显示错误提示："该资源暂无下载链接"

### 4.2 检查 Supabase Storage

1. **查看文件列表**
   - 在 Supabase Dashboard > Storage > course-resources
   - 查看所有已上传的文件
   - 验证文件路径结构是否正确

2. **查看存储用量**
   - 在 Storage 页面顶部可以看到已使用的存储空间
   - 免费版有 1GB 存储空间

---

## 常见问题

### Q1: 启动服务器时报错 "Missing Supabase environment variables"

**解决方案**：
- 确保 `.env` 文件在项目根目录
- 确保环境变量以 `VITE_` 开头
- 重启开发服务器（Ctrl+C 停止，然后 `pnpm dev` 重新启动）

### Q2: 上传文件时报错 "Upload failed: Unauthorized"

**解决方案**：
- 检查 `.env` 中的 `VITE_SUPABASE_ANON_KEY` 是否正确
- 确保 Storage Bucket 的 RLS 策略已正确配置
- 在 Supabase Dashboard 中验证 "Public Upload" 策略是否已启用

### Q3: 下载按钮点击后没反应

**解决方案**：
- 打开浏览器控制台（F12）查看错误信息
- 确保资源的 `downloadUrl` 字段已填写
- 验证 URL 是否可以直接在浏览器中访问

### Q4: 上传的文件在 Supabase 中看不到

**解决方案**：
- 检查 Bucket 名称是否为 `course-resources`（必须完全一致）
- 确保 "Public Upload" RLS 策略已创建并启用
- 查看浏览器控制台和网络请求，确认上传请求是否成功

### Q5: 页面显示空白或报错

**解决方案**：
- 确保所有依赖已安装：`pnpm install`
- 检查控制台错误信息
- 清除浏览器缓存并刷新页面
- 确保 Node.js 版本 >= 16

---

## 快速启动命令总结

```bash
# 1. 进入项目目录
cd /Users/air/Downloads/econai

# 2. 安装依赖（首次运行）
pnpm install

# 3. 启动开发服务器
pnpm dev

# 4. 在浏览器中打开
# 主页：http://localhost:5173
# 上传页面：http://localhost:5173/admin/upload
```

---

## 下一步建议

1. **数据持久化**：将资源数据迁移到 Supabase Database，实现动态数据管理
2. **用户认证**：添加 Supabase Auth 实现用户登录和权限控制
3. **批量上传**：支持一次选择多个文件上传
4. **文件管理**：添加文件删除、重命名功能
5. **搜索功能**：实现文件搜索和筛选

---

## 需要帮助？

- Supabase 文档：https://supabase.com/docs
- 项目 GitHub：（添加你的仓库链接）
- 问题反馈：（添加联系方式）
