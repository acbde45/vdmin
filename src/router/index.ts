import type { App } from 'vue';
import {
  createRouter,
  createWebHistory,
  RouteLocationNormalized,
  RouteLocationRaw,
  Router,
} from 'vue-router';
import assign from 'lodash-es/assign';
import { Pinia } from 'pinia';
import { useHistoryStore } from '../stores/useHistoryStore';
import { constantRoutes } from './routes';
import { createRouterGuards } from './routerGuards';

const router = createRouter({
  history: createWebHistory(),
  routes: constantRoutes,
  strict: true,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

let routerTrigger = false;
export const enhanceRouter = (piniaInstance: Pinia): Router => {
  const historyStore = useHistoryStore(piniaInstance);
  const { push, replace, go, back, forward, resolve } = router;
  const enhancedRouter: Router = assign(router, {
    push(location: RouteLocationRaw) {
      routerTrigger = true;
      historyStore.push(resolve(location));
      return push(location);
    },
    replace(location: RouteLocationRaw) {
      routerTrigger = true;
      historyStore.replace(resolve(location));
      return replace(location);
    },
    back() {
      routerTrigger = true;
      historyStore.pop({ delta: -1 });
      back();
    },
    forward() {
      routerTrigger = true;
      historyStore.pop({ delta: 1 });
      forward();
    },
    go(delta: number) {
      if (delta !== 0) {
        routerTrigger = true;
        historyStore.pop({ delta });
        go(delta);
      } else {
        window.location.reload();
      }
    },
  });

  enhancedRouter.afterEach((to: RouteLocationNormalized) => {
    if (to.matched.length > 0 && historyStore.records.length === 0) {
      historyStore.push(to);
    } else if (!routerTrigger && to.fullPath) {
      historyStore.pop({
        path: to.fullPath,
      });
    }
    routerTrigger = false;
  });

  return enhancedRouter;
};

export async function setupRouter(app: App, store: Pinia) {
  const router = enhanceRouter(store);
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router);
  // 路由准备就绪后挂载 APP 实例
  // https://router.vuejs.org/api/interfaces/router.html#isready
  await router.isReady();
}
