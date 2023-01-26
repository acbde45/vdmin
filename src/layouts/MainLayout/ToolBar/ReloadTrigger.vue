<template>
  <n-button text @click="reload">
    <template #icon>
      <n-icon :component="ReloadOutlined" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
  import { ReloadOutlined } from '@vicons/antd';

  function reload() {
    window.location.reload();
  }
</script>
