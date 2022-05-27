<template>
  <div
    class="vdmin-doc-container vdmin-doc-row"
    :class="{ 'vdmin-doc-container--with-simulator': hasSimulator }"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'Container',

  props: {
    hasSimulator: Boolean,
  },
};
</script>

<style lang="scss">
@import '../../common/style/var.scss';

.vdmin-doc-container {
  box-sizing: border-box;
  padding-left: $--vdmin-doc-nav-width;
  overflow: hidden;

  &--with-simulator {
    padding-right: $--vdmin-doc-simulator-width + $--vdmin-doc-padding;

    @media (max-width: 1100px) {
      padding-right: $--vdmin-doc-simulator-width - 8px;
    }
  }
}
</style>
