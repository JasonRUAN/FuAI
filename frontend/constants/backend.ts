/**
 * 后端服务配置
 */

// 后端服务基础 URL
export const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

// API 端点
export const API_ENDPOINTS = {
  // Pinata IPFS 上传（调用后端服务）
  PINATA_UPLOAD: `${BACKEND_URL}/pinata/upload`,
} as const;

// 导出常量对象（兼容 CONSTANTS.BACKEND_URL 格式）
export const CONSTANTS = {
  BACKEND_URL,
  API_ENDPOINTS,
} as const;
