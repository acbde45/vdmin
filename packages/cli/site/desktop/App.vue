<template>
  <div class="app">
    <DocRoot
      v-if="config"
      :config="config"
      :simulator="simulator"
      :has-simulator="hasSimulator"
    >
      <Breadcrumb />
      <router-view />
    </DocRoot>
  </div>
</template>

<script>
import DocRoot from './components/index.vue';
import { config } from 'site-desktop-shared';

export default {
  components: {
    DocRoot,
  },

  data() {
    return {
      hasSimulator: true,
    };
  },

  computed: {
    simulator() {
      if (config.site.simulator?.url) {
        return config.site.simulator?.url;
      }
      const path = location.pathname.replace(/\/index(\.html)?/, '/');
      return `${path}mobile.html${location.hash}`;
    },

    config() {
      return config.site;
    },
  },

  watch: {
    // eslint-disable-next-line
    '$route.path'() {
      this.setTitleAndToogleSimulator();
    },

    config: {
      handler(val) {
        if (val) {
          this.setTitleAndToogleSimulator();
        }
      },
      immediate: true,
    },
  },

  mounted() {
    if (this.$route.hash) {
      this.$nextTick(() => {
        const el = document.querySelector(this.$route.hash);
        if (el) {
          el.scrollIntoView();
        }
      });
    }
  },

  methods: {
    setTitleAndToogleSimulator() {
      let { title } = this.config;

      const navItems = this.config.nav.reduce(
        (result, nav) => [...result, ...nav.items],
        []
      );

      const current = navItems.find(
        (item) => item.path === this.$route.meta?.name
      );

      if (current && current.title) {
        title = current.title + ' - ' + title;
      } else if (this.config.description) {
        title += ` - ${this.config.description}`;
      }

      document.title = title;

      this.hasSimulator = !(
        config.site.hideSimulator ||
        this.config.hideSimulator ||
        (current && current.hideSimulator)
      );
    },
  },
};
</script>

<style lang="scss">
@import '../common/style/base.scss';
@import '../common/style/highlight.scss';

.van-doc-intro {
  padding-top: 20px;
  text-align: center;

  p {
    margin-bottom: 20px;
  }
}
</style>
