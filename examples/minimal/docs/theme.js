import Breadcrumb from "../src/components/breadcrumb.vue";

export default {
  enhanceApp({ app }) {
    app.component('Breadcrumb', Breadcrumb);
  }
};
