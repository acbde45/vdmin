import { viteMockServe as Mock } from 'vite-plugin-mock';

export function configMockPlugin(isBuild: boolean, prodMock: boolean) {
  return Mock({
    ignore: /^\_/,
    mockPath: 'mock',
    localEnabled: !isBuild,
    prodEnabled: isBuild && prodMock,
    //  这样可以控制关闭mock的时候不让mock打包到最终代码内
    injectCode: `
      import { setupProdMockServer } from '../mock/_createProductionServer';
      setupProdMockServer();
    `,
  });
}
