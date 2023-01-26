<template>
  <n-layout class="vd-main-layout" has-sider>
    <n-layout-sider
      v-if="layoutStore.layoutMode === LayoutMode.FIXED_SIDE_BAR"
      :class="['vd-main-layout__sidebar', { 'vd-main-layout__sidebar--float': !layoutStore.lock }]"
      collapse-mode="width"
      :collapsed="layoutStore.collapsed"
      :collapsed-width="settings.sideBar.collapsedWidth"
      :width="settings.sideBar.width"
      :content-style="{ height: '100%' }"
      :position="siderPosition"
    >
      <n-layout-header class="vd-main-layout__sidebar__header">
        <Brand />
      </n-layout-header>
      <n-layout class="vd-main-layout__sidebar__main" position="absolute">
        <SideMenu />
      </n-layout>
    </n-layout-sider>
    <n-layout class="vd-main-layout__layout">
      <n-layout-header class="vd-main-layout__layout__header">
        <Brand v-if="layoutStore.layoutMode === LayoutMode.FIXED_TOP_BAR" />
        <NavBar />
      </n-layout-header>
      <n-layout class="vd-main-layout__main" position="absolute" has-sider>
        <n-layout-sider
          v-if="layoutStore.layoutMode === LayoutMode.FIXED_TOP_BAR"
          class="vd-main-layout__layout__sidebar"
          collapse-mode="width"
          :collapsed="layoutStore.collapsed"
          :collapsed-width="settings.sideBar.collapsedWidth"
          :width="settings.sideBar.width"
          :content-style="{ height: '100%' }"
          :position="siderPosition"
        >
          <SideMenu />
        </n-layout-sider>
        <n-layout
          :class="[
            'vd-main-layout__content',
            { 'vd-main-layout__content--margin': !layoutStore.lock },
          ]"
        >
          <TabsView class="vd-main-layout__tabsview" />
          <n-layout
            :class="['vd-layout-content', { 'vd-layout-content--padding': !noPadding }]"
            :native-scrollbar="false"
            :scrollbar-props="{
              trigger: 'none',
            }"
          >
            <PublicLayout />
          </n-layout>
        </n-layout>
      </n-layout>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
  import { Brand, SideMenu, NavBar, TabsView } from '@/layouts/MainLayout';
  import { useMainLayoutStore, LayoutMode } from '@/stores/useMainLayoutStore';
  import { settings } from './settings';
  import PublicLayout from '../PublicLayout.vue';

  const layoutStore = useMainLayoutStore();

  const route = useRoute();

  const noPadding = computed(() => {
    return !!route?.meta?.noPadding;
  });

  const collapsedWidth = settings.sideBar.collapsedWidth + 'px';

  const siderPosition = computed(() => {
    return layoutStore.lock ? 'static' : 'absolute';
  });
</script>

<style lang="scss">
  .vd-main-layout {
    height: 100%;

    .vd-main-layout__layout {
      .vd-main-layout__layout__header {
        @apply flex items-center relative;
        height: var(--vd-layout-header-height);
        z-index: var(--vd-layout-header-zindex);
        border-bottom: 1px solid var(--n-border-color);
      }

      .vd-main-layout__layout__sidebar {
        box-shadow: var(--vd-layout-sidebar-shadow);
        z-index: var(--vd-layout-sidebar-zindex);
      }
    }

    .vd-main-layout__sidebar {
      @apply relative;
      box-shadow: var(--vd-layout-sidebar-shadow);
      z-index: var(--vd-layout-sidebar-zindex);

      &.vd-main-layout__sidebar--float {
        @apply absolute;
      }

      .vd-main-layout__sidebar__header {
        @apply flex items-center relative box-content;
        height: var(--vd-layout-header-height);
        & > div {
          border-bottom: 1px solid var(--n-border-color);
        }
      }

      .vd-main-layout__sidebar__main {
        top: var(--vd-layout-header-height);
      }
    }

    .vd-main-layout__main {
      top: var(--vd-layout-header-height);

      .vd-main-layout__content {
        @apply relative;

        & > .n-layout-scroll-container {
          overflow-y: hidden;
        }

        .vd-main-layout__tabsview {
          @apply absolute top-0 left-0;
          z-index: var(--vd-layout-tabsview-zindex);
        }

        &.vd-main-layout__content--margin {
          margin-left: v-bind(collapsedWidth);
        }
      }
    }
  }

  .vd-layout-content {
    height: calc(100% - var(--vd-layout-tabsview-height));
    margin-top: var(--vd-layout-tabsview-height);

    &.vd-layout-content--padding {
      .n-scrollbar {
        @apply p-md;
      }
    }
  }
</style>
