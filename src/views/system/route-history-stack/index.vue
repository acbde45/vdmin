<template>
  <div class="flex">
    <n-card title="history">
      <vue-json-pretty :data="menus" showIcon />
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  import { useHistoryStore } from '@/stores/useHistoryStore';

  const historyStore = useHistoryStore();

  const menus = computed(() => {
    return JSON.parse(JSON.stringify(historyStore.routes));
  });
</script>
