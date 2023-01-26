<template>
  <div class="vd-topmenu">
    <n-menu v-model:value="activeKey" mode="horizontal" :options="menuOptions" />
    {{ keepAliveComponents }}
  </div>
</template>

<script lang="ts" setup>
  import type { MenuOption } from 'naive-ui';
  import { useHistoryStore } from '@/stores/useHistoryStore';

  const menuOptions: MenuOption[] = reactive([]);
  const activeKey = ref<string | null>(null);

  const historyStore = useHistoryStore();
  const keepAliveComponents = computed(() => historyStore.keepAliveComponents);
</script>

<style lang="scss">
  .vd-topmenu {
    @apply flex-1;
  }
</style>
