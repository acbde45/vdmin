import { defineStore } from 'pinia';
import type { RouteLocationNormalized } from 'vue-router';
import { storage } from '@/utils/Storage';
import { TABS_ROUTES } from './mutationTypes';
import { PAGE_WHITE_LIST } from '@/router/constant';
import { PageEnum } from '@/enums/pageEnum';

export interface TabItem {
  key: string;
  name?: string;
  title?: string;
  affix?: boolean;
  icon?: string;
  path: string;
}

const WORKBENCH_ROUTE_ITEM = Object.freeze({
  key: PageEnum.WORKBENCH_PAGE_PATH,
  title: '工作台',
  affix: true,
  icon: 'MenuOutlined',
  path: PageEnum.WORKBENCH_PAGE_PATH,
}) as TabItem;

/**
 * 保留固定路由
 */
function retainAffixRoute(list: TabItem[]) {
  return list.filter((item) => item?.affix ?? false);
}

/**
 * 根据路由对象创建一个标签页
 */
export const createTabItem = (route: RouteLocationNormalized): TabItem => {
  const { meta, path, name } = route;
  return {
    key: path,
    name: name as string,
    title: meta?.title,
    affix: meta?.affix,
    icon: meta?.icon,
    path: path,
  };
};

export const useTabsViewStore = defineStore('tabsView', () => {
  const tabs = ref<TabItem[]>([]);

  /**
   * 初始化标签页
   */
  function initTabs(item: TabItem) {
    let cacheRoutes: TabItem[] = [];
    try {
      const routesStr = storage.get(TABS_ROUTES) as string | null | undefined;
      cacheRoutes = routesStr ? JSON.parse(routesStr) : [item];
    } catch (e) {
      cacheRoutes = [item];
    }
    if (cacheRoutes.findIndex((route) => route.path === PageEnum.WORKBENCH_PAGE_PATH) === -1) {
      cacheRoutes.unshift(WORKBENCH_ROUTE_ITEM);
    }
    tabs.value = cacheRoutes;
  }

  /**
   * 覆盖标签页记录
   */
  function setTabs(newTabs: TabItem[]) {
    tabs.value = newTabs;
  }

  /**
   * 添加标签页
   */
  function addTabs(item: TabItem): boolean {
    if (PAGE_WHITE_LIST.includes(item.name as PageEnum)) return false;
    const isExists = tabs.value.some((tab) => item.key == tab.key);
    if (!isExists) {
      tabs.value.push(item);
    }
    return true;
  }

  /**
   * 关闭左侧
   */
  function closeLeftTabs(item: TabItem) {
    const index = tabs.value.findIndex((item) => item.key == item.key);
    tabs.value = tabs.value.filter((item, i) => i >= index || (item?.affix ?? false));
  }

  /**
   * 关闭右侧
   */
  function closeRightTabs(tab: TabItem) {
    const index = tabs.value.findIndex((item) => item.key === tab.key);
    tabs.value = tabs.value.filter((item, i) => i <= index || (item?.affix ?? false));
  }

  /**
   * 关闭其他
   */
  function closeOtherTabs(route: TabItem) {
    tabs.value = tabs.value.filter((item) => item.key == route.key || (item?.affix ?? false));
  }

  /**
   * 关闭当前页
   */
  function closeCurrentTab(item: TabItem) {
    const index = tabs.value.findIndex((tab) => item.key === tab.key);
    tabs.value.splice(index, 1);
  }

  /**
   * 关闭全部
   */
  function closeAllTabs() {
    tabs.value = retainAffixRoute(tabs.value);
  }

  return {
    tabs,
    initTabs,
    setTabs,
    addTabs,
    closeLeftTabs,
    closeRightTabs,
    closeOtherTabs,
    closeCurrentTab,
    closeAllTabs,
  };
});
