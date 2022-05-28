import { createApp } from 'vue';
import App from './App.vue';
// import DemoPlayground from './components/DemoPlayground.vue';
import { THEME_FILE } from 'site-desktop-shared';
import { router } from './router';

const app = createApp(App)
  .use(router)
  // .component(DemoPlayground.name, DemoPlayground);

if (THEME_FILE) {
  import(/* @vite-ignore */ THEME_FILE).then(module => {
    const themeConfig = module.default;
    if (themeConfig.enhanceApp) {
      themeConfig.enhanceApp({ app });
    }
  });
}


window.app = app;

setTimeout(() => {
  window.app.mount('#app');
}, 0);
