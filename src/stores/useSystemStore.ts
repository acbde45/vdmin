import { VNodeChild } from 'vue';
import flattenDeep from 'lodash-es/flattenDeep';
import {
  BalloonOutline,
  BicycleSharp,
  BoatOutline,
  BookmarkOutline,
  SettingsOutline,
} from '@vicons/ionicons5';
import { MenuOutlined } from '@vicons/antd';
import {
  getUserInfo as getUserInfoRequest,
  login as loginRequest,
  UserInfo,
} from '@/api/system/user';
import {
  BasicMenuConfig,
  getMenuConfigTree as getMenuConfigTreeRequest,
  MenuConfigType,
  RootMenuConfig,
} from '@/api/system/menu';
import { renderFontUnicodeIcon, renderIcon } from '@/utils';
import { storage } from '@/utils/Storage';
import { ACCESS_TOKEN, CURRENT_USER } from '@/stores/mutationTypes';
import { Pojo } from '#types/utils';

export interface ProjectMenuOption {
  key: string;
  code: string;
  label: string;
  route?: string;
  icon: () => VNodeChild | undefined;
  type: MenuConfigType;
  props?: Pojo;
  children?: ProjectMenuOption[];
}

const menuIconCache: Pojo = {};
/**
 * 返回 NaiveUI 渲染图标的函数
 * @param iconName 菜单定义里的字符串icon名称
 */
export function renderMenuIcon(iconName: string): () => VNodeChild {
  if (menuIconCache[iconName]) return menuIconCache[iconName];
  if (iconName === 'MenuOutlined') {
    menuIconCache[iconName] = renderIcon(MenuOutlined);
  } else if (iconName === 'SettingsOutline') {
    menuIconCache[iconName] = renderIcon(SettingsOutline);
  } else if (iconName === 'BookmarkOutline') {
    menuIconCache[iconName] = renderIcon(BookmarkOutline);
  } else if (iconName === 'BalloonOutline') {
    menuIconCache[iconName] = renderIcon(BalloonOutline);
  } else if (iconName === 'BicycleSharp') {
    menuIconCache[iconName] = renderIcon(BicycleSharp);
  } else if (iconName === 'BoatOutline') {
    menuIconCache[iconName] = renderIcon(BoatOutline);
  } else if (iconName) {
    menuIconCache[iconName] = renderFontUnicodeIcon(iconName);
  }
  return menuIconCache[iconName];
}

function generateMenuOptions(menuConfigTree: BasicMenuConfig[]): ProjectMenuOption[] {
  const mapTree = (
    tree: BasicMenuConfig[],
    resolver: (n: BasicMenuConfig) => ProjectMenuOption
  ): ProjectMenuOption[] => {
    const mapTreeItem = (list: BasicMenuConfig[]) => {
      return list
        .map((node: any) => ({ ...node }))
        .map((node) => {
          node.subMenus = node.subMenus && mapTreeItem(node.subMenus);
          return resolver(node);
        });
    };

    return mapTreeItem(tree);
  };

  const firstMapRes = mapTree(menuConfigTree, (menuConfig: BasicMenuConfig): ProjectMenuOption => {
    const option = {
      key: menuConfig.code,
      code: menuConfig.code,
      label: menuConfig.name,
      icon: renderMenuIcon(menuConfig.icon),
      type: menuConfig.type,
    };
    if (['menu'].includes(menuConfig.type)) {
      return { ...option, route: menuConfig.route };
    }
    return { ...option, children: menuConfig.subMenus as unknown as ProjectMenuOption[] };
  });

  return firstMapRes;
}

// 登陆信息过期时间
const ex = 7 * 24 * 60 * 60;

export const useSystemStore = defineStore('user', () => {
  const token = ref<string>(storage.get(ACCESS_TOKEN, ''));
  const userInfo = ref<UserInfo | null>(storage.get(CURRENT_USER, null));
  const menuConfigTree = ref<RootMenuConfig[]>([]);
  const menuOptions = ref<ProjectMenuOption[]>([]);

  const flattenMenuOptions = computed(() => flattenDeep(menuOptions.value));

  async function login(data: Pojo) {
    try {
      const toekn = await loginRequest(data);
      storage.set(ACCESS_TOKEN, toekn, ex);
      token.value = toekn;
      return Promise.resolve(toekn);
    } catch (e) {
      return Promise.reject(e);
    }
  }

  async function getUserInfo(): Promise<UserInfo> {
    return new Promise((resolve, reject) => {
      getUserInfoRequest()
        .then((res) => {
          userInfo.value = res;
          storage.set(CURRENT_USER, res, ex);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  async function getMenuConfigTree(): Promise<RootMenuConfig[]> {
    return new Promise((resolve, reject) => {
      getMenuConfigTreeRequest()
        .then((res) => {
          menuConfigTree.value = res;
          menuOptions.value = generateMenuOptions(res);
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  return {
    token,
    userInfo,
    menuConfigTree,
    menuOptions,
    flattenMenuOptions,
    login,
    getUserInfo,
    getMenuConfigTree,
  };
});
