# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 常用命令

- `pnpm dev`：启动开发服务器
- `pnpm build`：构建生产环境扩展（输出到 `dist/` 目录）
- `pnpm type-check`：检查 TypeScript 类型（不生成文件）

## 项目结构

- `src/` 源代码目录
  - `components/`：自动导入的 Vue 组件（如 `HelloButton.vue`）
  - `sidepanel/`：侧边栏界面（Vue 组件及入口）
  - `background.ts`：后台脚本（持久化逻辑）
  - `content.ts`：内容脚本（与网页交互）
- `public/`：静态资源（含 `manifest.json` 和图标）
- `dist/`：生产构建输出目录

## Chrome 扩展部署

1. 运行 `npm run build` 生成 `dist/` 目录
2. 打开 `chrome://extensions` → 开启开发者模式
3. 点击 "加载已解压的扩展程序" → 选择 `dist/` 目录

## 技术栈

- Vue 3 + Vite
- Tailwind CSS 样式
- 组件/API 自动导入（`unplugin-vue-components` 和 `unplugin-auto-import`）

## 自动导入配置

- `unplugin-vue-components`：自动注册 `src/components/` 下的组件
- `unplugin-auto-import`：自动导入 `vue` 和 `vue-router` 的 API（如 `ref`, `computed` 等）
- 类型声明文件：
  - `src/auto-imports.d.ts`：Vue API 自动导入类型
  - `src/components.d.ts`：组件自动注册类型（由插件生成）

## 注意事项

- `vue-router` 在 `vite.config.ts` 中被引用但未安装（dead config）
- `src/composables` 目录在 AutoImport 配置中被引用，但实际不存在