import type { RouteRecordNormalized, RouteRecordRaw } from 'vue-router';
import { isNavigationFailure, Router } from 'vue-router';
import { useSystemStore } from '@/stores/useSystemStore';
import { useAsyncRouteStore } from '@/stores/useAsyncRouteStore';
import { ACCESS_TOKEN } from '@/stores/mutationTypes';
import { storage } from '@/utils/Storage';
import { ErrorPageRoute, WorkbenchPageRoute } from '@/router/base';
import { PageEnum } from '@/enums/pageEnum';
import { useHistoryStore } from '@/stores/useHistoryStore';

const whitePathList: string[] = [PageEnum.LOGIN_PAGE_PATH]; // no redirect whitelist

export function createRouterGuards(router: Router) {
  const userStore = useSystemStore();
  const asyncRouteStore = useAsyncRouteStore();
  router.beforeEach(async (to, from, next) => {
    const Loading = window['$loading'] || null;
    Loading && Loading.start();
    if (from.name === PageEnum.LOGIN_PAGE_PATH && to.name === PageEnum.ERROR_PAGE_NAME) {
      next(WorkbenchPageRoute.path);
      return;
    }

    // Whitelist can be directly entered
    if (whitePathList.includes(to.path)) {
      next();
      return;
    }

    const token = storage.get(ACCESS_TOKEN);

    // if (!token) {
    //   // You can access without permissions. You need to set the routing meta.ignoreAuth to true
    //   if (to.meta.ignoreAuth) {
    //     next();
    //     return;
    //   }
    //   // redirect login page
    //   const redirectData: { path: string; replace: boolean; query?: Pojo } = {
    //     path: LOGIN_PATH,
    //     replace: true,
    //   };
    //   if (to.path) {
    //     redirectData.query = {
    //       ...redirectData.query,
    //       redirect: to.path,
    //     };
    //   }
    //   next(redirectData);
    //   return;
    // }

    if (asyncRouteStore.isDynamicAddedRoute) {
      next();
      return;
    }

    const [userInfo, menuConfigTree] = await Promise.all([
      userStore.getUserInfo(),
      userStore.getMenuConfigTree(),
    ]);
    const routes = await asyncRouteStore.generateRoutes(menuConfigTree);

    // 动态添加可访问路由表
    routes.forEach((item) => {
      router.addRoute(item);
    });

    // 添加404
    const isErrorPage = router
      .getRoutes()
      .findIndex((item) => item.name === PageEnum.ERROR_PAGE_NAME);
    if (isErrorPage === -1) {
      router.addRoute(ErrorPageRoute as unknown as RouteRecordRaw);
    }

    const redirectPath = (from.query.redirect || to.path) as string;
    const redirect = decodeURIComponent(redirectPath);
    const nextData = to.path === redirect ? { ...to, replace: true } : { path: redirect };
    asyncRouteStore.setDynamicAddedRoute(true);
    next(nextData);
    Loading && Loading.finish();
  });

  router.afterEach((to, from, failure) => {
    if (isNavigationFailure(failure)) {
      // console.log("failed navigation", failure);
    }
    const historyStore = useHistoryStore();
    // 在这里设置需要缓存的组件名称
    const keepAliveComponents = historyStore.keepAliveComponents;
    const currentRoute: RouteRecordNormalized | undefined = to.matched.find(
      (item) => item.name == to.name
    );
    const currentCompName = currentRoute?.components?.default?.name;
    if (currentCompName && !keepAliveComponents.includes(currentCompName) && to.meta?.keepAlive) {
      // 需要缓存的组件
      keepAliveComponents.push(currentCompName);
    } else if (!to.meta?.keepAlive || from.name === PageEnum.REDIRECT_PAGE_NAME) {
      // 不需要缓存的组件
      const index = keepAliveComponents.findIndex((name) => name == currentCompName);
      if (index != -1) {
        keepAliveComponents.splice(index, 1);
      }
    }
    historyStore.setKeepAliveComponents(keepAliveComponents);
    const Loading = window['$loading'] || null;
    Loading && Loading.finish();
  });

  router.onError((error) => {
    console.log(error, '路由错误');
  });
}
