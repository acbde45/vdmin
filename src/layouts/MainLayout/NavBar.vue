<template>
  <div :class="['vd-navbar', { 'vd-navbar--margin': needMargin }]">
    <MenuFoldTrigger v-if="layoutStore.lock" class="ml-sm" />
    <Breadcrumb class="ml-sm" />
    <TopMenu class="mx-sm" />
    <ToolBar class="mr-sm" />
  </div>
</template>

<script setup lang="ts">
  import { MenuFoldTrigger, Breadcrumb, TopMenu, ToolBar } from '.';
  import { LayoutMode, useMainLayoutStore } from '@/stores/useMainLayoutStore';
  import { settings } from './settings';

  const layoutStore = useMainLayoutStore();

  const needMargin = computed(() => {
    return layoutStore.layoutMode === LayoutMode.FIXED_SIDE_BAR && !layoutStore.lock;
  });

  const collapsedWidth = settings.sideBar.collapsedWidth + 'px';
</script>

<style lang="scss">
  .vd-navbar {
    @apply inline-flex items-center h-full w-full;

    &.vd-navbar--margin {
      margin-left: v-bind(collapsedWidth);
    }
  }
</style>
