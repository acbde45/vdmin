import { http } from '@/utils/http/axios';
import { Pojo } from '#types/utils';

export interface UserInfo {
  loginName: string;
  organizationId: number;
  realName: string;
  language: string;
  timeZone: string;
  tenantName: string;
  tenantNum: string;
  dateFormat: string;
  timeFormat: string;
  dateTimeFormat: string;
  title: string;
  waterMarkRule: string;
  avatar: string;
}

/**
 * 获取用户信息
 */
export function getUserInfo() {
  return http.request<UserInfo>({
    url: '/api/admin_info',
    method: 'get',
  });
}

/**
 * 用户登录
 */
export function login(params: Pojo) {
  return http.request<string>({
    url: '/api/login',
    method: 'POST',
    params,
  });
}
