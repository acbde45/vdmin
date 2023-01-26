import { h, Component } from 'vue';
import { NIcon } from 'naive-ui';
import isObject from 'lodash-es/isObject';
import { PageEnum } from '@/enums/pageEnum';

/**
 * render 图标
 * */
export function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) });
}
/**
 * font 图标（Font class）
 * */
export function renderFontClassIcon(icon: string, iconName = 'iconfont') {
  return () => h('span', { class: [iconName, icon] });
}
/**
 * font 图标（Unicode）
 * */
export function renderFontUnicodeIcon(icon: string, iconName = 'iconfont') {
  return () => h('span', { class: [iconName], innerHTML: icon });
}

/**
 * font svg 图标
 * */
export function renderFontSvgIcon(icon: string) {
  return () =>
    h(NIcon, null, {
      default: () =>
        h('svg', { class: `icon`, 'aria-hidden': 'true' }, h('use', { 'xlink:href': `#${icon}` })),
    });
}

/**
 * 排除Router
 * */
export function filterRouter(routerMap: Array<any>) {
  return routerMap.filter((item) => {
    return (
      (item.meta?.hidden || false) != true &&
      !['/:path(.*)*', '/', PageEnum.REDIRECT_PAGE_PATH, PageEnum.LOGIN_PAGE_PATH].includes(
        item.path
      )
    );
  });
}

export function deepMerge<T = any>(src: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    src[key] = isObject(src[key]) ? deepMerge(src[key], target[key]) : (src[key] = target[key]);
  }
  return src;
}

/**
 * 判断是否 url
 * */
export function isUrl(url: string) {
  return /^(http|https):\/\//g.test(url);
}
