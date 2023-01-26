import type { MessageApi, DialogApi, NotificationApi } from 'naive-ui';
import { LoadingBarInst } from 'naive-ui/es/loading-bar/src/LoadingBarProvider';

declare module 'vue-router' {
  interface RouteMeta {
    code?: string;
    icon?: string;
    title?: string;
    keepAlive?: boolean;
    noPadding?: boolean;
    parent?: string;
    affix?: boolean;
    hideBreadcrumb?: boolean;
  }
}

declare global {
  interface Window {
    // naive discrete apis
    $message: MessageApi;
    $dialog: DialogApi;
    $notification: NotificationApi;
    $loading: LoadingBarInst;
  }
}
