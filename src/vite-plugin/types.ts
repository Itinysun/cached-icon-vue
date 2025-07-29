/* eslint-disable @typescript-eslint/no-explicit-any */

// Vite 版本兼容性类型定义
export interface VitePluginCompat {
  name: string
  config?: (config: any, env: any) => void
  configureServer?: (server: any) => void
}

export interface RequestResponse {
  statusCode: number
  end: (data: string) => void
  setHeader: (name: string, value: string) => void
}

export interface Request {
  method?: string
  url?: string
  headers: { host?: string }
  on: (event: string, callback: (data: any) => void) => void
}
