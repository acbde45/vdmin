import { createApp } from 'vue';
import App from './App.vue';
// import DemoPlayground from './components/DemoPlayground.vue';
import theme from '@vdmin/docs/theme';
import { router } from './router';

const app = createApp(App)
  .use(router)
  // .component(DemoPlayground.name, DemoPlayground);

if (theme) {
  if (theme.enhanceApp) {
    theme.enhanceApp({ app });
  }
}


window.app = app;

setTimeout(() => {
  window.app.mount('#app');
}, 0);
