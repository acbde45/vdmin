<template>
  <div class="vd-sidebar" @mouseenter="floatSideBar(true)" @mouseleave="floatSideBar(false)">
    <div class="vd-sidebar__menu">
      <n-scrollbar>
        <n-menu
          :value="activeKey"
          :collapsed="layoutStore.collapsed"
          :collapsed-width="settings.sideBar.collapsedWidth"
          :collapsed-icon-size="settings.sideBar.collapsedIconSize"
          :indent="settings.sideBar.menuIndent"
          :options="menuOptions"
          :render-label="renderMenuLabel"
          :expand-icon="expandIcon"
          @update:value="handleMenuUpdate"
        />
      </n-scrollbar>
    </div>
    <div class="vd-sidebar__bottom">
      <n-divider />
      <div
        :class="[
          'vd-sidebar__bottom__buttons',
          { 'vd-sidebar__bottom__buttons--collapsed': layoutStore.collapsed },
        ]"
      >
        <n-popover trigger="hover">
          <template #trigger>
            <n-button tertiary circle type="primary" @click="layoutStore.toggleLock">
              <template #icon>
                <n-icon :component="layoutStore.lock ? LockOutlined : UnlockOutlined" />
              </template>
            </n-button>
          </template>
          <span v-if="layoutStore.lock">悬浮菜单</span>
          <span v-else>固定菜单</span>
        </n-popover>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { NIcon } from 'naive-ui';
  import { LockOutlined, UnlockOutlined } from '@vicons/antd';
  import { ChevronDown } from '@vicons/ionicons5';
  import { useMainLayoutStore } from '@/stores/useMainLayoutStore';
  import { ProjectMenuOption, useSystemStore } from '@/stores/useSystemStore';
  import { settings } from './settings';

  const layoutStore = useMainLayoutStore();
  const userStore = useSystemStore();

  const floatSideBar = useThrottleFn((float: boolean) => {
    if (layoutStore.lock) return;
    if (float) {
      layoutStore.collapsed = false;
    } else {
      layoutStore.collapsed = true;
    }
  }, 300);

  const menuOptions: ProjectMenuOption[] = userStore.menuOptions;

  function renderMenuLabel(menuOption: ProjectMenuOption) {
    if (menuOption.type === 'link') {
      return h('a', { href: menuOption.route, target: '_blank' }, menuOption.label);
    }
    return menuOption.label;
  }

  function expandIcon() {
    return h(NIcon, null, { default: () => h(ChevronDown) });
  }

  const router = useRouter();
  const activeKey = ref(router.currentRoute.value.meta?.code);
  function handleMenuUpdate(key: string, menuOption: ProjectMenuOption) {
    activeKey.value = key;
    if (menuOption.type === 'menu' && menuOption.route) {
      router.push(menuOption.route);
    }
  }

  watchEffect(() => {
    activeKey.value = router.currentRoute.value.meta?.code;
  });

  const bottomHeight = settings.sideBar.bottomHeight + 'px';
</script>

<style lang="scss">
  .vd-sidebar {
    @apply h-full relative overflow-hidden;

    .vd-sidebar__menu {
      @apply h-full box-border;
      padding-bottom: v-bind(bottomHeight);
    }

    .vd-sidebar__bottom {
      @apply w-full box-border bottom-0 absolute;
      height: v-bind(bottomHeight);

      & > .n-divider {
        @apply m-0 absolute;
        top: -1px;
      }

      .vd-sidebar__bottom__buttons {
        @apply px-md space-x-sm;

        &.vd-sidebar__bottom__buttons--collapsed {
          @apply text-center grid grid-cols-1;

          & > .n-button {
            @apply mr-auto ml-auto;
          }
        }

        & > .n-button {
          @apply rounded-md mt-sm;
        }
      }
    }
  }
</style>
