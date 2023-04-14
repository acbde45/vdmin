import Mock from 'mockjs';
import type { MockMethod } from 'vite-plugin-mock';
import { resultSuccess } from '../_util';

const Random = Mock.Random;

const token = Random.string('upper', 32, 32);

const adminInfo = {
  loginName: Random.word(5),
  organizationId: Random.integer(1, 1),
  realName: Random.cword(3),
  language: 'zh_CN',
  timeZone: 'GMT+8',
  tenantName: '三一集团',
  tenantNum: 'SANY-GROUP',
  dateFormat: 'YYYY-MM-DD',
  timeFormat: 'HH:mm:ss',
  dateTimeFormat: 'YYYY-MM-DD HH:mm:ss',
  title: '后台管理平台',
  waterMarkRule: '${realName}',
  avatar: Random.image(),
};

export default [
  {
    url: '/api/login',
    timeout: 1000,
    method: 'post',
    response: () => {
      return resultSuccess({ token });
    },
  },
  {
    url: '/api/admin_info',
    timeout: 1000,
    method: 'get',
    response: () => {
      // const token = getRequestToken(request);
      // if (!token) return resultError('Invalid token');
      return resultSuccess(adminInfo);
    },
  },
] as MockMethod[];
