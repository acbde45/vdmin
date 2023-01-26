<template>
  <n-button text @click="toggle">
    <template #icon>
      <n-icon v-if="isFullscreen" :component="FullscreenExitOutlined" />
      <n-icon v-else :component="FullscreenOutlined" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
  import { useFullscreen } from '@vueuse/core';
  import { FullscreenExitOutlined, FullscreenOutlined } from '@vicons/antd';

  const { isFullscreen, toggle } = useFullscreen(document.body);
</script>
