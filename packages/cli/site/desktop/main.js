import { createApp } from 'vue';
import App from './App.vue';
// import DemoPlayground from './components/DemoPlayground.vue';
import { config } from 'site-desktop-shared';
import { router } from './router';

const app = createApp(App)
  .use(router)
  // .component(DemoPlayground.name, DemoPlayground);

if (config.site?.enhanceApp) {
  config.site.enhanceApp({ app });
}

window.app = app;

setTimeout(() => {
  window.app.mount('#app');
}, 0);
