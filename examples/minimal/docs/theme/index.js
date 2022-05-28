import Breadcrumb from "../../src/components/Breadcrumb.vue";

export default {
  enhanceApp({ app }) {
    app.component('Breadcrumb', Breadcrumb);
  }
};
