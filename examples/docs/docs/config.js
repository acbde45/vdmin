const path = require('path');
const { normalizePath, mergeConfig } = require('vite');

export default {
  name: "vdmin-example-demo",
  site: {
    title: "Vdmin Docs",
    description: "一个项目文档",
  },
  docs: {
    nav: [
      {
        title: "开发指南",
        group: "guide",
        items: [
          {
            path: "home",
            title: "介绍",
          },
        ],
      },
      {
        title: "基础组件",
        group: "components",
        items: [
          {
            path: "Breadcrumb",
            title: "面包屑",
          },
        ],
      },
    ],
  },
  build: {
    outDir: "../dist/docs",
    configureVite(config) {
      return mergeConfig(config, {
        css: {
          preprocessorOptions: {
            scss: {
              additionalData: `
                @import '${normalizePath(path.join(__dirname, '../src'))}/styles/variables.scss';
              `
            },
          }
        }
      }, true);
    }
  }
};
