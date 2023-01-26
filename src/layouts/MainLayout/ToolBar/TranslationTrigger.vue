<template>
  <n-button text>
    <template #icon>
      <n-icon :component="TranslationOutlined" />
    </template>
  </n-button>
</template>

<script setup lang="ts">
  import { TranslationOutlined } from '@vicons/antd';
</script>
