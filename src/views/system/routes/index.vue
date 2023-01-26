<template>
  <div class="flex">
    <n-card class="mr-md" title="routes">
      <vue-json-pretty :data="routes" showIcon :deep="2" />
    </n-card>
    <n-card title="addRoutes">
      <vue-json-pretty :data="addRoutes" showIcon :deep="2" />
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  import { useAsyncRouteStore } from '@/stores/useAsyncRouteStore';

  const asyncRouteStore = useAsyncRouteStore();

  const routes = computed(() => {
    return JSON.parse(JSON.stringify(asyncRouteStore.routes));
  });

  const addRoutes = computed(() => {
    return JSON.parse(JSON.stringify(asyncRouteStore.addRoutes));
  });
</script>
