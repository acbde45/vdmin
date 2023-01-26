import type { Plugin, PluginOption } from 'vite';
import Vue from '@vitejs/plugin-vue';
import vueJsx from '@vitejs/plugin-vue-jsx';
import WindiCSS from 'vite-plugin-windicss';
import { ViteEnv } from '#types/config';
import { configCompressPlugin } from './compress';
import { configMockPlugin } from './mock';
import { configAutoImportPlugin } from './autoImport';
import { configSvgIconsPlugin } from './svgIcons';

export function createVitePlugins(viteEnv: ViteEnv, isBuild: boolean, prodMock: boolean) {
  const { VITE_USE_MOCK, VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE } = viteEnv;

  const vitePlugins = [
    Vue(),
    vueJsx(),
    WindiCSS(),
    configSvgIconsPlugin(),
    configAutoImportPlugin(),
  ] as (Plugin | Plugin[] | PluginOption[])[];

  VITE_USE_MOCK && vitePlugins.push(configMockPlugin(isBuild, prodMock));

  if (isBuild) {
    // rollup-plugin-gzip
    vitePlugins.push(
      configCompressPlugin(VITE_BUILD_COMPRESS, VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE)
    );
  }

  return vitePlugins;
}
