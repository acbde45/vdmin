import BreadCrumb from "./src/components/breadcrumb.vue";

module.exports = {
  name: 'minimal',
  site: {
    title: "Vdmin Docs",
    description: "一个项目文档",
    enhanceApp({ app }) {
      app.component('BreadCrumb', BreadCrumb)
    },
    nav: [
      {
        title: '开发指南',
        group: 'guide',
        items: [
          {
            path: 'home',
            title: '介绍',
          },
        ]
      },
      {
        title: '基础组件',
        group: 'components',
        items: [
          {
            path: 'breadcrumb',
            title: '面包屑'
          }
        ]
      }
    ],
  },
};