<template>
  <div class="vd-user-control">
    <n-dropdown
      show-arrow
      placement="bottom-end"
      trigger="click"
      :options="options"
      @select="handleSelect"
    >
      <div class="vd-user-control__trigger">
        <n-avatar class="vd-user-control__avatar" round> M </n-avatar>
        <n-icon class="vd-user-control__caretdown" :component="CaretDownOutlined" />
      </div>
    </n-dropdown>
  </div>
</template>

<script setup lang="ts">
  import { Component } from 'vue';
  import { NIcon } from 'naive-ui';
  import { CaretDownOutlined } from '@vicons/antd';
  import { PersonCircleOutline as UserIcon, LogOutOutline as LogoutIcon } from '@vicons/ionicons5';

  const message = useMessage();

  const renderIcon = (icon: Component) => {
    return () => {
      return h(NIcon, null, {
        default: () => h(icon),
      });
    };
  };

  const options = [
    {
      label: '个人中心',
      key: 'personal center',
      icon: renderIcon(UserIcon),
    },
    {
      label: '退出登录',
      key: 'logout',
      icon: renderIcon(LogoutIcon),
    },
  ];

  function handleSelect(key: string | number) {
    message.info('' + key);
  }
</script>

<style lang="scss">
  .vd-user-control {
    @apply inline-flex items-center pr-sm cursor-pointer;

    .vd-user-control__trigger {
      @apply space-x-sm inline-flex items-center text-base;
    }

    .vd-user-control__avatar {
      @apply font-semibold;
    }
  }
</style>
