<template>
  <div class="vdmin-doc-demo-block">
    <h2 v-if="title" class="vdmin-doc-demo-block__title">{{ title }}</h2>
    <div v-if="card" class="vdmin-doc-demo-block__card">
      <slot />
    </div>
    <slot v-else />
  </div>
</template>

<script>
export default {
  name: 'DemoBlock',

  props: {
    card: Boolean,
    title: String,
  },
};
</script>

<style lang="scss">
@import '../../common/style/var.scss';

.vdmin-doc-demo-block {
  &__title {
    margin: 0;
    padding: 32px 16px 16px;
    color: $--vdmin-doc-text-light-blue;
    font-weight: normal;
    font-size: 14px;
    line-height: 16px;
  }

  &__card {
    margin: 12px 12px 0;
    overflow: hidden;
    border-radius: 8px;
  }

  &__title + &__card {
    margin-top: 0;
  }

  &:first-of-type {
    .vdmin-doc-demo-block__title {
      padding-top: 20px;
    }
  }
}
</style>
