<template>
  <router-view v-slot="{ Component, route }">
    <keep-alive :include="keepAliveComponents">
      <component :key="route.fullPath" :is="Component" />
    </keep-alive>
  </router-view>
</template>

<script setup lang="ts">
  import { useHistoryStore } from '@/stores/useHistoryStore';

  const historyStore = useHistoryStore();

  const keepAliveComponents = computed(() => historyStore.keepAliveComponents);
</script>
