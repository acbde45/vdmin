import { RouteComponent, RouteRecordRaw } from 'vue-router';
import { Lazy } from '#types/utils';
import { setupLayouts } from 'virtual:generated-layouts';
import generatedRoutes from 'virtual:generated-pages';
import {
  LoginPageRoute,
  RootRoute,
  WorkbenchPageRoute,
  RedirectPageRoute,
  PageRouteRecordRaw,
} from '@/router/base';

export const asyncRoutes: RouteRecordRaw[] = setupLayouts([
  ...generatedRoutes.map((pageRoute) =>
    PageRouteRecordRaw(pageRoute.component as Lazy<RouteComponent>)(pageRoute)
  ),
  // PageRouteRecordRaw(Demo)("/pageA", { msg: "Page A" }, true),
  // PageRouteRecordRaw(Demo)({
  //   path: "/pageA",
  //   meta: { msg: "Page A", keepAlive: true },
  // }),
  // PageRouteRecordRaw(() => import("../components/Demo.vue"))(
  //   "/pageB",
  //   { msg: "Page B" },
  //   true
  // ),
]);

// 预设路由 无需验证权限
export const constantRoutes: RouteRecordRaw[] = [
  RootRoute,
  LoginPageRoute,
  RedirectPageRoute,
  WorkbenchPageRoute,
];
