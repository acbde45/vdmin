import { nextTick } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { config, documents } from 'site-desktop-shared';
import { isMobile, decamelize } from '../common';
import { listenToSyncPath, syncPathToChild } from '../common/iframe-router';

if (isMobile) {
  location.replace('mobile.html' + location.hash);
}

function parseName(name) {
  if (name.indexOf('_') !== -1) {
    const pairs = name.split('_');
    const component = pairs.shift();

    return {
      component: `${decamelize(component)}`,
    };
  }

  return {
    component: `${decamelize(name)}`,
  };
}

function getRoutes() {
  const routes = [];
  const names = Object.keys(documents);

  routes.push({
    name: 'notFound',
    path: '/:path(.*)+',
    redirect: {
      name: 'home',
    },
  });

  function addHomeRoute(Home) {
    routes.push({
      name: 'home',
      path: `/`,
      component: Home,
      meta: {},
    });
  }

  names.forEach((name) => {
    const { component } = parseName(name);

    if (component === 'home') {
      addHomeRoute(documents[name]);
    }

    routes.push({
      name: `${component}`,
      path: `/${component}`,
      component: documents[name],
      meta: {
        name: component,
      },
    });
  });

  return routes;
}

export const router = createRouter({
  history: createWebHashHistory(),
  routes: getRoutes(),
  scrollBehavior(to) {
    if (to.hash) {
      return { el: to.hash };
    }

    return { top: 0 };
  },
});

router.afterEach(() => {
  nextTick(syncPathToChild);
});

if (config.site.simulator?.syncPathFromSimulator !== false) {
  listenToSyncPath(router);
}

window.vueRouter = router;
