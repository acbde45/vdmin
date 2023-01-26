import { PageEnum } from '@/enums/pageEnum';

export const MainLayout = () => import('@/layouts/MainLayout');
export const PublicLayout = () => import('@/layouts/PublicLayout.vue');

export const PAGE_WHITE_LIST: PageEnum[] = [
  PageEnum.LOGIN_PAGE_NAME,
  PageEnum.REDIRECT_PAGE_NAME,
  PageEnum.ERROR_PAGE_NAME,
];
