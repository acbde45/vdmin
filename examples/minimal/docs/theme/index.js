import Vant, { Toast } from 'vant';
import 'vant/lib/index.css';
import Breadcrumb from "../../src/components/Breadcrumb.vue";

export default {
  enhanceApp({ app }) {
    app.use(Vant);
    Toast.setDefaultOptions({ duration: 2000 });
    app.component('Breadcrumb', Breadcrumb);
  }
};
