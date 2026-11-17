# 迁移前存储调查

调查及本地迁移日期：2026-11-16（America/Los_Angeles）。已从用户提供的 ZIP 恢复资料并修改网站地址。推送到 main 后由现有 GitHub Pages 工作流发布；部署结果见 [GitHub Actions](https://github.com/Reed2006/Awesome_Notes_Site/actions/workflows/gh-pages.yml)。

## 本地迁移结果

- 原始备份：`afyuxngkeyapjrncfxsz.storage.zip`，已通过 ZIP CRC 完整性检查，保留在本地并加入 Git 忽略。
- 备份包含 26 个文件，合计 52,359,054 字节（约 52 MB），覆盖下方原始清单中的全部 25 个不同文件，还额外包含一份 Financial Markets 笔记。
- 已恢复到 `public/resources/`，保留 bucket 分类目录；这些文件需要随源码一起提交。
- `src/lib/courseData.ts` 与 `src/components/desktop/ContentArea.tsx` 中原有的 26 处 Supabase URL 已改为 `getResourceUrl()`，支持 Vite 的站点基础路径。
- 原来公司金融的两份笔记指向同一个 PDF。核对额外文件 `Corporate Finance/financial market.pdf` 的首页为 Financial Markets – Yale University Course Notes 后，已将 Shiller's Notes 改为引用该文件。
- 经济史两个 ZIP 继续使用现有 GitHub Raw 地址；没有重复复制到站点资源目录。
- 清单 JSON 保留旧下载地址及当时的 DNS 检查结果，新增本地路径、大小、SHA-256、预期部署路径与恢复记录。`references` 字段是清单中 `commit` 对应的原始代码位置。

## 目标托管方案

使用现有 GitHub Pages 托管 `public/resources/`，Vite 构建会将文件复制到 `dist/resources/`，当前部署工作流会一并上传。发布后文件地址形如：

`https://reed2006.github.io/Awesome_Notes_Site/resources/P.E/Sample_paper.pdf`

下载、PDF 预览、MP3、封面及贡献者图片均使用网站同源路径，日常访问不需要 Supabase 配置。新增资料时，放入 `public/resources/分类/文件名`，再在资源清单中使用 `getResourceUrl('分类/文件名')`。

[GitHub Pages 官方限制](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)：已发布站点不超过 1 GB，每月流量软限制 100 GB。本次约 52 MB 资料适合目前的学习分享站规模；免费服务不承诺永久不变，原始 ZIP 和 Git 仓库应保留备份。

旧 `/admin/upload` 管理页仍使用 Supabase，且上传后本来就不会自动更新硬编码的课程清单。本次未改造上传功能。

## 已确认的存储位置

| 内容 | 原位置 | 本地状态 |
| --- | --- | --- |
| 网站源码 | [Reed2006/Awesome_Notes_Site](https://github.com/Reed2006/Awesome_Notes_Site) 的 main 分支 | 已克隆到本目录，包含当前版本的 Git 信息（浅克隆） |
| 网站部署 | [GitHub Pages](https://reed2006.github.io/Awesome_Notes_Site/) | 部署流程见 `.github/workflows/gh-pages.yml` |
| 主要课程资料、proposal、音乐及部分图片 | Supabase Storage，项目域名 `afyuxngkeyapjrncfxsz.supabase.co` | 已从用户提供的 ZIP 恢复到 `public/resources/` |
| 经济史论文合集 | `big-files/economic-history-essay-sets.zip`，通过 GitHub Raw 下载 | 已随仓库下载，69,621,364 字节 |
| 经济史历年试题 | `big-files/economic-history-past-papers.zip`，通过 GitHub Raw 下载 | 已随仓库下载，79,525,266 字节 |
| 研究报告正文 | `src/content/narrative-crash-report.md` | 已随仓库下载 |
| 研究报告配图、贡献者头像副本 | `public/narrative-images/`、`public/contributors/` | 已随仓库下载；头像副本尚未与远端文件核对一致性 |

课程下载链接集中在 `src/lib/courseData.ts`。头像、音乐和封面链接位于 `src/components/desktop/ContentArea.tsx`。迁移前线上首页引用的 JS 也使用上述 Supabase 项目域名；线上版本需发布后才会更新。

## Supabase 文件清单

迁移前源码共有 25 个不同的 Supabase 文件 URL，涉及 11 个 bucket：

| Bucket | 不同文件数 |
| --- | ---: |
| P.E | 4 |
| microeconomics | 5 |
| Macroeconomics | 4 |
| Corporate Finance | 1 |
| Game theory | 3 |
| CSAPP | 2 |
| Convex Optimization | 1 |
| Workshop | 1 |
| Proposals | 1 |
| Contributor | 1 |
| music | 2 |

完整原始 URL、bucket、对象路径与代码引用见同目录的 `storage-inventory.json`。原始引用清单只覆盖源码引用；用户 ZIP 中额外的一份文件也已恢复并单独记录。

迁移前，课程资料中 21 个不同的下载对象、1 个在线预览 PDF，以及头像、MP3、音乐封面 3 个文件，合计 25 个。修正 Shiller's Notes 后，本地实际引用 26 个不同文件。

## 可用性检查

- 对全部 25 个 Supabase URL 发送 HEAD 请求，均在 DNS 解析阶段失败，无法取得 HTTP 状态码、文件大小或内容。
- 用 curl 单独复核文件下载入口，也返回 `Could not resolve host`。
- Google Public DNS 与 Cloudflare DNS 的 A 记录查询均返回 `Status: 3`（NXDOMAIN），说明并非仅本机 DNS 失败。
- 仓库 GitHub Releases 列表为空，未发现 Release 附件备份。

目前只能确定公开域名不可用，不能据此断言文件已经删除，也不能确认是否由项目暂停、删除或其他项目状态造成。

## 恢复来源说明

资料已从用户提供的 ZIP 补齐，本地迁移不再依赖恢复 Supabase 项目。未登录后台，也未变更或删除旧项目。

`src/services/storage.ts` 的上传功能使用 `course-resources` bucket，但当前公开资料的实际链接使用上表中的 11 个 bucket；迁移不能只依据旧配置指南中的 bucket 名称。

## 其他外部依赖

- 项目截图使用 `image.thum.io` 在线截图服务。
- favicon 和社交分享图片使用 `b.ux-cdn.com`。
- Reed 的头像使用 `github.com/Reed2006.png`。

这些不属于上面 25 个 Supabase 对象。本轮未备份这些外部生成或第三方资源。

## 验证结果

- `pnpm build`：通过，资料已复制到生产构建目录。
- `pnpm verify:resources`：通过，检查全部 26 个实际代码引用的资源，确认站点基础路径、HTTP 200、非 HTML 内容、文件大小及 SHA-256；额外检查 MP3 和 proposal PDF 的 HTTP 206 分段响应。
- 构建 JS 中已无旧 Supabase 项目域名。
- 曾复现 Workshop 文件名中的逗号被编码为 `%2C` 后，Vite 预览服务返回首页 HTML 的问题；URL 生成函数现保留合法的路径标点，完整性检查已覆盖这个 ZIP。
- `git diff --check`：通过。

复查命令：先运行 `pnpm build`，再运行 `pnpm verify:resources`。校验脚本使用本机临时预览服务，结束后自动关闭。当前结果为本地验证，部署后仍需核对线上页面及资源。
