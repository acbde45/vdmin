import { createApp } from 'vue';
import theme from '@vdmin/docs/theme';
import DemoBlock from './components/DemoBlock.vue';
import DemoSection from './components/DemoSection.vue';
import { router } from './router';
import App from './App.vue';
import './utils/touch-emulator';

const app = createApp(App)
  .use(router)
  .component(DemoBlock.name, DemoBlock)
  .component(DemoSection.name, DemoSection);

if (theme) {
  if (theme.enhanceApp) {
    theme.enhanceApp({ app });
  }
}

window.app = app;

setTimeout(() => {
  window.app.mount('#app');
}, 0);
