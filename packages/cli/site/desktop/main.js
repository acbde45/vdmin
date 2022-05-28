import { createApp } from 'vue';
import App from './App.vue';
import theme from '@vdmin/docs/theme';
import { router } from './router';

const app = createApp(App)
  .use(router);

if (theme) {
  if (theme.enhanceApp) {
    theme.enhanceApp({ app });
  }
}


window.app = app;

setTimeout(() => {
  window.app.mount('#app');
}, 0);
