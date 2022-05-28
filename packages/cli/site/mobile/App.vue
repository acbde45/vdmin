<template>
  <Nav />
  <router-view v-slot="{ Component }">
    <keep-alive>
      <DemoSection>
        <component :is="Component" />
      </DemoSection>
    </keep-alive>
  </router-view>
</template>

<script>
import Nav from './components/Nav.vue';

export default {
  components: { Nav },
};
</script>

<style lang="scss">
@import '../common/style/var.scss';
@import '../common/style/base.scss';

body {
  min-width: 100vw;
}

::-webkit-scrollbar {
  width: 0;
  background: transparent;
}
</style>
