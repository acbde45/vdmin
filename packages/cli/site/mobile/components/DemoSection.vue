<template>
  <section class="vdmin-doc-demo-section" :class="demoName">
    <slot />
  </section>
</template>

<script>
import { decamelize } from '../../common';

export default {
  name: 'DemoSection',

  computed: {
    demoName() {
      const { meta } = this.$route || {};
      if (meta && meta.name) {
        return `demo-${decamelize(meta.name)}`;
      }

      return '';
    },
  },
};
</script>

<style lang="scss">
.vdmin-doc-demo-section {
  box-sizing: border-box;
  min-height: calc(100vh - 56px);
}
</style>
