import { RouteComponent, RouteMeta, RouteRecordRaw } from 'vue-router';
import { MainLayout } from '@/router/constant';
import { PageEnum } from '@/enums/pageEnum';
import { Lazy } from '#types/utils';

let pageRouteIdx = 0;
/**
 * 给没有设置name属性的页面增加name属性
 */
export function PageRouteRecordRaw(
  comp: RouteComponent | Lazy<RouteComponent>
): (
  pathOrRoute: string | Omit<RouteRecordRaw, 'component'>,
  props?: Record<string, any>,
  keepAlive?: boolean,
  meta?: RouteMeta
) => RouteRecordRaw {
  const Comp = (name: string): RouteComponent => {
    if (comp instanceof Function) {
      return async () => {
        const compRel = await (comp as Lazy<{ default: RouteComponent }>)();
        if (compRel.default.name) return compRel.default;
        return { ...compRel.default, name };
      };
    }
    if (comp.name) return comp;
    return { ...comp, name: name };
  };

  return (pathOrRoute, props, keepAlive, meta) => {
    if (typeof pathOrRoute === 'object') {
      const route = pathOrRoute;
      return {
        ...route,
        component: Comp(`internal_comp_${++pageRouteIdx}_${route.path}`),
      } as RouteRecordRaw;
    }
    const path = pathOrRoute;
    return {
      path,
      component: Comp(`internal_comp_${++pageRouteIdx}_${path}`),
      props,
      meta: { ...meta, keepAlive },
    };
  };
}

export const WorkbenchPageRoute: RouteRecordRaw = {
  path: '/workbench',
  component: MainLayout,
  children: [
    PageRouteRecordRaw(() => import('@/pages/workbench/index.vue'))({
      path: '',
      name: PageEnum.WORKBENCH_PAGE_NAME,
    }),
  ],
  meta: {
    hideBreadcrumb: true,
    keepAlive: true,
    affix: true,
    title: '工作台',
    icon: 'MenuOutlined',
  },
};

export const ErrorPageRoute: RouteRecordRaw = {
  path: '/:path(.*)*',
  component: MainLayout,
  children: [
    PageRouteRecordRaw(() => import('@/pages/exception/404.vue'))({
      path: '/:path(.*)*',
      name: PageEnum.ERROR_PAGE_NAME,
      meta: {
        hideBreadcrumb: true,
      },
    }),
  ],
};

export const RedirectPageRoute: RouteRecordRaw = {
  path: '/redirect/:path(.*)',
  component: MainLayout,
  children: [
    PageRouteRecordRaw(() => import('@/pages/redirect/index.vue'))({
      path: '',
      name: PageEnum.REDIRECT_PAGE_NAME,
      meta: {
        hideBreadcrumb: true,
      },
    }),
  ],
};

export const RootRoute: RouteRecordRaw = {
  path: '/',
  name: 'Root',
  redirect: PageEnum.WORKBENCH_PAGE_PATH,
};

export const LoginPageRoute: RouteRecordRaw = PageRouteRecordRaw(
  () => import('@/pages/login/index.vue')
)({
  path: '/login',
  name: PageEnum.LOGIN_PAGE_NAME,
});
