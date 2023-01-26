import type {
  RouteComponent,
  RouteMeta,
  RouteRecordRaw,
  RouteRecordRedirectOption,
} from 'vue-router';
import { Lazy, Pojo } from '#types/utils';

export type RawRouteComponent = RouteComponent | Lazy<RouteComponent>;
export type AppRouteRecordRaw<T extends RouteRecordRaw = RouteRecordRaw> = T extends {
  redirect: RouteRecordRedirectOption;
}
  ? T
  : T extends { children: any }
  ? Omit<T, 'children'> & { children: AppRouteRecordRaw[] }
  : T extends { component: RawRouteComponent }
  ? {
      [K in keyof T]: T[K] extends RawRouteComponent ? T[K] | string : T[K];
    }
  : {
      [K in keyof T]: T[K] extends Record<string, RawRouteComponent>
        ? Record<string, RawRouteComponent | string>
        : T[K];
    };

export interface Meta {
  // 名称
  title: string;
  // 是否需要认证
  auth?: boolean;
  // 权限
  permissions?: string[];
  // 是否缓存
  keepAlive?: boolean;
  // 是否固定在tab上
  affix?: boolean;
  // tab上的图标
  icon?: string;
  // 跳转地址
  frameSrc?: string;
  // 外链跳转地址
  externalLink?: string;
  // 隐藏
  hidden?: boolean;
}

export interface Menu {
  title: string;
  label: string;
  key: string;
  meta: RouteMeta;
  name: string;
  component?: RawRouteComponent | string;
  components?: Record<string, RawRouteComponent | string>;
  children?: RouteRecordRaw[];
  props?: Pojo;
  fullPath?: string;
  icon?: string;
  path: string;
  permissions?: string[];
  redirect?: string;
  sort?: number;
}
