<template>
  <n-button text>
    <template #icon>
      <n-icon :component="SettingOutlined" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
  import { SettingOutlined } from '@vicons/antd';
</script>
