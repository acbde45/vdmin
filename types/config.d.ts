export interface ViteEnv {
  VITE_PORT: number;
  VITE_USE_MOCK: boolean;
  VITE_PUBLIC_PATH: string;
  VITE_GLOB_APP_TITLE: string;
  VITE_GLOB_APP_SHORT_NAME: string;
  VITE_DROP_CONSOLE: boolean;
  VITE_GLOB_PROD_MOCK: boolean;
  VITE_GLOB_IMG_URL: string;
  VITE_PROXY: [string, string][];
  VITE_BUILD_COMPRESS: 'gzip' | 'brotli' | 'none';
  VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE: boolean;
}

export interface GlobEnvConfig {
  // 标题
  VITE_GLOB_APP_TITLE: string;
  // 接口地址
  VITE_GLOB_API_URL: string;
  // 接口前缀
  VITE_GLOB_API_URL_PREFIX?: string;
  // Project abbreviation
  VITE_GLOB_APP_SHORT_NAME: string;
  // 图片上传地址
  VITE_GLOB_UPLOAD_URL?: string;
  //图片前缀地址
  VITE_GLOB_IMG_URL?: string;
  //生产环境开启mock
  VITE_GLOB_PROD_MOCK: boolean;
}
