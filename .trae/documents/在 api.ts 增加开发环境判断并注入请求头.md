## 目标
- 仅在开发环境为请求添加指定 Header；生产环境不携带该 Header。
- 改动范围限定在 `src/api.ts`，保持现有返回结构与错误处理不变。

## 现状
- 客户端：使用 `axios` 直接调用。
- 文件：`src/api.ts:38–46` 始终设置了 `x-use-ppe` 与 `x-tt-env` Header，并使用绝对 URL。
- 项目为 Vite，支持 `import.meta.env.DEV` 进行开发环境判断。

## 实施步骤
1. 在 `src/api.ts` 中新增开发环境判断：`const isDev = import.meta.env.DEV`。
2. 条件化 Header：
   - 开发：沿用当前两个 Header。
   - 生产：不设置（传入 `undefined`）。
3. 保持 `axios.post` 第三参 `{ headers }` 结构不变；当 `headers` 为 `undefined` 时，不会附加自定义头。

## 代码修改（示例）
- 文件：`src/api.ts`
- 替换 `38–46` 行为：
```ts
const isDev = import.meta.env.DEV
const headers = isDev
  ? {
      'x-use-ppe': '1',
      'x-tt-env': 'ppe_6612519540'
    }
  : undefined

const url =
  'https://motor-admin.bytedance.net/motor/owner_price_mis/go_api/open_api/vin_info'
const response = await axios.post<CarInfoResponse>(url, params, { headers })
```

## 可选优化（如需启用本地代理）
- 让开发环境走 Vite 代理（与 `vite.config.js` 的 `/motor/owner_price_mis` 前缀一致）：
```ts
const url = isDev
  ? '/motor/owner_price_mis/go_api/open_api/vin_info'
  : 'https://motor-admin.bytedance.net/motor/owner_price_mis/go_api/open_api/vin_info'
```
- 若不需要代理，则保持绝对 URL 不变。

## 验证方案
- 开发模式：`npm run dev` 下触发接口，网络面板应包含 `x-use-ppe` 与 `x-tt-env`。
- 生产构建：`npm run build` 后部署或本地预览，不应包含上述 Header。
- 确认返回结构与错误处理逻辑未变（`status === 200`、`resSt === '0'`）。

## 影响与兼容性
- `import.meta.env.DEV` 为 Vite 原生变量；不会影响 TypeScript 结构与 axios 默认头。
- 变更仅影响请求头；不更改返回类型与现有数据处理逻辑。