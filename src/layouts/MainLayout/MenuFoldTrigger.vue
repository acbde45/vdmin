<template>
  <n-button text type="primary" @click="layoutStore.toggleSideBar">
    <template #icon>
      <n-icon :component="layoutStore.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
  import { MenuUnfoldOutlined, MenuFoldOutlined } from '@vicons/antd';
  import { useMainLayoutStore } from '@/stores/useMainLayoutStore';

  const layoutStore = useMainLayoutStore();
</script>
