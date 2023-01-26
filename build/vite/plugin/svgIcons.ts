import path from 'path';
import { createSvgIconsPlugin as SvgIcons } from 'vite-plugin-svg-icons';

export function configSvgIconsPlugin() {
  return SvgIcons({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'src/assets')],
    // 指定symbolId格式
    symbolId: 'icon-[dir]-[name]',

    /**
     * 自定义插入位置
     * @default: body-last
     * 'body-last' | 'body-first'
     */
    inject: 'body-last',

    /**
     * custom dom id
     * @default: __svg__icons__dom__
     */
    customDomId: '__svg__icons__dom__',
  });
}
