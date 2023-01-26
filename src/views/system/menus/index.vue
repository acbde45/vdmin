<template>
  <div class="flex">
    <n-card title="menus">
      <vue-json-pretty :data="menus" showIcon />
    </n-card>
  </div>
</template>

<script setup lang="ts">
  import VueJsonPretty from 'vue-json-pretty';
  import 'vue-json-pretty/lib/styles.css';

  import { useSystemStore } from '@/stores/useSystemStore';

  const systemStore = useSystemStore();

  const menus = computed(() => {
    return JSON.parse(JSON.stringify(systemStore.menuOptions));
  });
</script>
