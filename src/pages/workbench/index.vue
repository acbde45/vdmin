<template>
  <div>
    {{ routes }}
  </div>
  <n-input />
  <div style="padding-bottom: 2000px"></div>
</template>

<script setup lang="ts">
  import { useHistoryStore } from '@/stores/useHistoryStore';

  const historyStore = useHistoryStore();

  const routes = computed(() => historyStore.routes);
</script>

<route lang="yaml">
meta:
  keepAlive: true
</route>
