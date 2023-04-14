import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';

const menusTree = [
  {
    code: 'system',
    name: '系统操作',
    quickIndex: '',
    type: 'root',
    sort: 0,
    icon: 'SettingsOutline',
    labels: [],
    subMenus: [
      {
        code: 'system.tabview',
        name: '标签栏操作',
        quickIndex: '',
        type: 'menu',
        sort: 0,
        icon: 'BookmarkOutline',
        route: '/system/tabview',
        labels: [],
      },
      {
        code: 'system.routes',
        name: '路由信息',
        quickIndex: '',
        type: 'menu',
        sort: 0,
        icon: 'BookmarkOutline',
        route: '/system/routes',
        labels: [],
      },
      {
        code: 'system.menus',
        name: '菜单信息',
        quickIndex: '',
        type: 'menu',
        sort: 0,
        icon: 'BookmarkOutline',
        route: '/system/menus',
        labels: [],
      },
      {
        code: 'system.route-history-stack',
        name: '路由堆栈',
        quickIndex: '',
        type: 'menu',
        sort: 0,
        icon: 'BookmarkOutline',
        route: '/system/route-history-stack',
        labels: [],
      },
    ],
  },
  {
    code: 'route-params',
    name: '路由参数',
    quickIndex: '',
    type: 'root',
    sort: 0,
    icon: 'BalloonOutline',
    labels: [],
    subMenus: [
      {
        code: 'route-params.query',
        name: 'query参数',
        quickIndex: '',
        type: 'menu',
        sort: 0,
        icon: 'BicycleSharp',
        route: '/route-params/query',
        labels: [],
      },
      {
        code: 'route-params.params',
        name: 'params参数',
        quickIndex: '',
        type: 'menu',
        sort: 0,
        icon: 'BoatOutline',
        route: '/route-params/params',
        labels: [],
      },
    ],
  },
];

export default [
  {
    url: '/api/menus/tree',
    timeout: 1000,
    method: 'get',
    response: () => {
      return resultSuccess(menusTree);
    },
  },
] as MockMethod[];
