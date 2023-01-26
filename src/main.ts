import App from './App.vue';
import { setupRouter } from './router';
import { setupStore } from './stores';
import { setupDirectives } from './directives';
import { setupNaiveDiscreteApi } from './naiveDiscreteApi';

// vite-plugin-svg-icons 使用时需要注册
import 'virtual:svg-icons-register';
// css工具类
import 'virtual:windi-base.css';
import 'virtual:windi-components.css';
import 'virtual:windi-utilities.css';
// 通用字体
import 'vfonts/Lato.css';
// 等宽字体
import 'vfonts/FiraCode.css';
// css变量
import './styles/variables.scss';

async function bootstrap() {
  // 创建 Vue App
  const app = createApp(App);

  // 使用pinia进行状态管理
  const store = setupStore(app);

  // 挂载naive-ui脱离上下文的 Api
  setupNaiveDiscreteApi();

  // 注册全局自定义指令，如：v-permission权限指令
  setupDirectives(app);

  // 使用vue-router管理路由，需要等待路由准备就绪之后再挂载
  await setupRouter(app, store);

  app.mount('#app');
}

void bootstrap();
