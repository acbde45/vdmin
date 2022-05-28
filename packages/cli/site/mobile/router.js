import { watch, nextTick } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import Home from './components/Home.vue';
import { decamelize } from '../common';
import { demos } from 'site-mobile-shared';
import { listenToSyncPath, syncPathToParent } from '../common/iframe-router';

function getRoutes() {
  const routes = [];
  const names = Object.keys(demos);
  
  routes.push({
    name: 'NotFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'home',
    },
  });

  routes.push({
    name: 'home',
    path: '/',
    component: Home,
  });

  names.forEach((name) => {
    const component = decamelize(name);

    routes.push({
      name: component,
      path: `/${component}`,
      component: demos[name],
      meta: {
        name,
      },
    });
  });

  return routes;
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: getRoutes(),
  scrollBehavior: (to, from, savedPosition) => savedPosition || { x: 0, y: 0 },
});

watch(router.currentRoute, () => {
  if (!router.currentRoute.value.redirectedFrom) {
    nextTick(syncPathToParent);
  }
});

listenToSyncPath(router);

window.vueRouter = router;
