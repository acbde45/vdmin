import path from 'path';
import { ConfigEnv, loadEnv, UserConfigExport } from 'vite';
import { format } from 'date-fns';
import { wrapperEnv } from './build/utils';
import { createVitePlugins } from './build/vite/plugin';
import { createProxy } from './build/vite/proxy';
import { OUTPUT_DIR } from './build/constant';

import pkg from './package.json';

const { dependencies, devDependencies, name, version } = pkg;
const __APP_INFO__ = {
  pkg: { dependencies, devDependencies, name, version },
  lastBuildTime: format(new Date(), 'yyyy-MM-dd HH:mm:ss'),
};

function pathResolve(dir: string) {
  return path.resolve(process.cwd(), '.', dir);
}

// https://vitejs.dev/config/
export default ({ command, mode }: ConfigEnv): UserConfigExport => {
  const root = process.cwd();
  const env = loadEnv(mode, root);
  const viteEnv = wrapperEnv(env);
  const { VITE_PUBLIC_PATH, VITE_PORT, VITE_GLOB_PROD_MOCK, VITE_PROXY } = viteEnv;
  const prodMock = VITE_GLOB_PROD_MOCK;
  const isBuild = command === 'build';

  return {
    base: VITE_PUBLIC_PATH,
    resolve: {
      alias: [
        {
          find: '#types/',
          replacement: pathResolve('types') + '/',
        },
        {
          find: '@/',
          replacement: pathResolve('src') + '/',
        },
      ],
      dedupe: ['vue'],
    },
    define: {
      __APP_INFO__: JSON.stringify(__APP_INFO__),
    },
    plugins: createVitePlugins(viteEnv, isBuild, prodMock),
    optimizeDeps: {
      include: [],
      exclude: ['vue-demi'],
    },
    server: {
      port: VITE_PORT,
      open: true,
      proxy: createProxy(VITE_PROXY),
    },
    build: {
      target: 'es2015',
      cssTarget: 'chrome80',
      outDir: OUTPUT_DIR,
      reportCompressedSize: false,
      chunkSizeWarningLimit: 2000,
    },
  };
};
