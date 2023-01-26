<template>
  <n-dropdown trigger="click" :options="options" :show-arrow="true" @select="handleSelect">
    <n-button class="vd-tabsview-menu" text>
      <template #icon>
        <n-icon :component="MenuOutlined" />
      </template>
    </n-button>
  </n-dropdown>
</template>

<script setup lang="ts">
  import { DropdownOption, NIcon } from 'naive-ui';
  import {
    MenuOutlined,
    ArrowLeftOutlined,
    ArrowRightOutlined,
    ReloadOutlined,
    CloseOutlined,
  } from '@vicons/antd';
  import { renderIcon } from '@/utils';

  const options = [
    {
      label: '刷新当前',
      key: 'reload-current',
      icon: renderIcon(ReloadOutlined),
    },
    {
      label: '关闭其他',
      key: 'close-others',
      icon: renderIcon(CloseOutlined),
    },
    {
      label: '关闭右侧',
      key: 'close-others-right',
      icon: renderIcon(ArrowLeftOutlined),
    },
    {
      label: '关闭左侧',
      key: 'close-others-left',
      icon: renderIcon(ArrowRightOutlined),
    },
  ];

  const router = useRouter();
  const route = useRoute();

  function handleSelect(key: string | number, option: DropdownOption) {
    if (key === 'reload-current') {
      router.push({
        path: '/redirect' + unref(route)?.fullPath,
      });
    }
  }
</script>

<style lang="scss">
  .vd-tabsview-menu {
    @apply mr-md ml-sm;
  }
</style>
