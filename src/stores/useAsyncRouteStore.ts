import { RouteRecordRaw } from 'vue-router';
import { asyncRoutes, constantRoutes } from '@/router/routes';
import { BasicMenuConfig, LeafMenuConfig, MenuConfig } from '@/api/system/menu';

function extractLeafMenuConfigList(menuConfigTree: BasicMenuConfig[]): LeafMenuConfig[] {
  const extract = (result: LeafMenuConfig[], menuConfig: BasicMenuConfig) => {
    if (menuConfig.type === 'menu') {
      result.push(menuConfig as MenuConfig);
      return result;
    }
    if (Array.isArray(menuConfig.subMenus)) {
      const results = menuConfig.subMenus.reduce(extract, []);
      result.push(...results);
    }
    return result;
  };

  return menuConfigTree.reduce(extract, []);
}

function generateAccessedRoutes(
  asyncRoutes: RouteRecordRaw[],
  resolver: (route: RouteRecordRaw) => boolean
) {
  function filter(list: RouteRecordRaw[]) {
    return list
      .map((node: any) => ({ ...node }))
      .filter((node) => {
        if (resolver(node)) {
          return true;
        }
        node.children = node.children && filter(node.children);
        return node.children && node.children.length > 0;
      });
  }

  return filter(asyncRoutes);
}

export const useAsyncRouteStore = defineStore('asyncRoute', () => {
  const routes = ref<RouteRecordRaw[]>(constantRoutes);
  const addRoutes = ref<RouteRecordRaw[]>([]);
  const isDynamicAddedRoute = ref<boolean>(false);

  function setDynamicAddedRoute(newValue: boolean) {
    isDynamicAddedRoute.value = newValue;
  }

  async function generateRoutes(menuConfigTree: BasicMenuConfig[]) {
    const menuConfigList: LeafMenuConfig[] = extractLeafMenuConfigList(menuConfigTree);
    let accessedRoutes: RouteRecordRaw[] = [];
    try {
      accessedRoutes = generateAccessedRoutes(asyncRoutes, (route: RouteRecordRaw) => {
        const menuConfig = menuConfigList.find((menuConfig) => menuConfig.route === route.path);
        if (!!menuConfig) {
          route.meta = Object.assign({}, route.meta, {
            code: menuConfig.code,
            title: menuConfig.name,
            icon: menuConfig.icon,
          });
        }
        return !!menuConfig;
      });
    } catch (error) {
      console.log(error);
    }
    routes.value = routes.value.concat(accessedRoutes);
    addRoutes.value = accessedRoutes;
    return accessedRoutes;
  }

  return {
    routes,
    addRoutes,
    isDynamicAddedRoute,
    setDynamicAddedRoute,
    generateRoutes,
  };
});
