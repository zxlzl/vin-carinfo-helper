import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    cors: true,
    origin: 'https://motor-admin.bytedance.net',
    proxy: {
      // 匹配以 /api/vin 开头的请求，转发到目标接口
      '/motor/owner_price_mis/api': {
        target: 'https://motor-admin.bytedance.net', // 目标接口域名+路径前缀
        changeOrigin: true, // 关键：让后端认为请求来自目标域名（伪造 Origin）
        // rewrite: (path) =>{
          // const url = path.replace(/^\/motor\/owner_price_mis\/api/, '')
        //   console.log('%cvite.config.js:19 url', 'color: #007acc;', url);
        //   return url
        // },
        // 若接口是 HTTPS，需添加（避免证书校验错误）
        secure: false,
        // 新增：开启代理日志
        logLevel: 'debug', // 打印详细代理日志
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            // 终端打印：转发的目标地址
            console.log(`[Proxy] 转发请求到：${options.target}${req.url}`)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            // 终端打印：目标接口的响应状态码
            console.log(`[Proxy] 响应状态码：${proxyRes.statusCode}`)
          })
        }
      }
    }
  },
  build: {
    rollupOptions: {
      external: ['#minpath', '#minproc', '#minurl']
    }
  }
})
