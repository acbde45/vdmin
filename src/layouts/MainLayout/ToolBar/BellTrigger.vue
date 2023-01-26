<template>
  <n-button text>
    <template #icon>
      <n-icon :component="BellOutlined" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
  import { BellOutlined } from '@vicons/antd';
</script>
