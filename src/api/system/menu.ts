import { http } from '@/utils/http/axios';

export type MenuConfigType = 'root' | 'dir' | 'menu' | 'link' | 'inner-link' | 'window';

export interface BasicMenuConfig {
  code: string;
  name: string;
  quickIndex: string;
  parentId: number;
  type: MenuConfigType;
  sort: number;
  icon: string;
  route: string;
  labels: string[];
  subMenus: (
    | DirMenuConfig
    | InnerLinkMenuConfig
    | MenuConfig
    | LinkMenuConfig
    | WindowMenuConfig
  )[];
}

export interface RootMenuConfig extends BasicMenuConfig {
  parentId: never;
  type: 'root';
  route: never;
}

export interface DirMenuConfig extends BasicMenuConfig {
  type: 'dir';
  route: never;
}

export interface InnerLinkMenuConfig extends BasicMenuConfig {
  type: 'inner-link';
  subMenus: never;
}

export interface MenuConfig extends BasicMenuConfig {
  type: 'menu';
  subMenus: never;
}

export interface LinkMenuConfig extends BasicMenuConfig {
  type: 'link';
  subMenus: never;
}

export interface WindowMenuConfig extends BasicMenuConfig {
  type: 'window';
  subMenus: never;
}

export type LeafMenuConfig = InnerLinkMenuConfig | MenuConfig | LinkMenuConfig | WindowMenuConfig;

/**
 * 获取tree菜单列表
 * @param params
 */
export function getMenuConfigTree() {
  return http.request<RootMenuConfig[]>({
    url: '/api/menus/tree',
    method: 'GET',
  });
}
