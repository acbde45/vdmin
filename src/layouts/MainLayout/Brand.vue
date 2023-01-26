<template>
  <div :class="['vd-brand', { 'vd-brand--collapsed': brandCollapsed }]">
    <Transition name="vd-brand__logo">
      <div
        :class="['vd-brand__logo', { 'vd-brand__logo--collapsed': brandCollapsed }]"
        :style="logoStylesWithCollapsed"
      >
        <SvgIcon :name="logoMiniName" v-if="brandCollapsed" />
        <SvgIcon :name="logoName" v-else />
      </div>
    </Transition>
    <Transition name="vd-brand__title" mode="out-in">
      <div class="vd-brand__title" v-if="!brandCollapsed && !onlyLogo">
        {{ systemName }}
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
  import { settings } from './settings';
  import { LayoutMode, useMainLayoutStore } from '@/stores/useMainLayoutStore';

  const logoName = settings.logo.name;
  const logoMiniName = settings.logo.miniName;
  const systemName = settings.system.name;
  const onlyLogo = settings.header.brand.onlyLogo;
  const logoStyles = settings.logo.styles;
  const collapsedWidth = settings.sideBar.collapsedWidth + 'px';
  const width = settings.sideBar.width + 'px';

  const layoutStore = useMainLayoutStore();

  const brandCollapsed = computed(() => {
    return layoutStore.layoutMode === LayoutMode.FIXED_TOP_BAR && !layoutStore.lock
      ? false
      : layoutStore.collapsed;
  });

  const logoStylesWithCollapsed = computed(() => {
    return brandCollapsed ? logoStyles : {};
  });
</script>

<style lang="scss">
  .vd-brand {
    @apply px-md space-x-sm inline-flex items-center;
    width: v-bind(width);
    flex: 0 0 v-bind(width);
    height: var(--vd-layout-header-height);
    transition: width 0.3s var(--n-bezier);
    box-sizing: border-box;

    &.vd-brand--collapsed {
      width: v-bind(collapsedWidth);
      flex: 0 0 v-bind(collapsedWidth);
    }

    .vd-brand__logo {
      @apply text-center;
      height: var(--vd-brand-logo-height);

      .vd-brand__logo--collapsed {
        @apply w-full;
      }
    }

    .vd-brand__title {
      @apply w-max font-semibold text-xl;
    }
  }

  .vd-brand__title-enter-active {
    transition: all 0.3s var(--n-bezier) 0.15s;
  }
  .vd-brand__title-enter-from {
    opacity: 0;
  }
  .vd-brand__title-leave-from {
    opacity: 0;
  }
  .vd-brand__logo-leave-active {
    transition: all 0.3s var(--n-bezier);
  }
  .vd-brand__logo-leave-to {
    opacity: 0;
  }
</style>
