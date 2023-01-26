import { computed, ComputedRef, ref } from 'vue';
import { defineStore } from 'pinia';
import { RouteLocationNormalizedLoaded, RouteRecordName } from 'vue-router';

type HistoryRecord = {
  name: RouteRecordName | null | undefined;
  path: string;
  keepAlive: boolean;
};

type Direction = 'forward' | 'backward' | '';

const createRecord = (route: RouteLocationNormalizedLoaded): HistoryRecord => {
  return {
    name: route.name,
    path: route.fullPath,
    keepAlive: (route?.meta?.keepAlive as boolean) || false,
  };
};

export const useHistoryStore = defineStore('history', () => {
  // 历史路由数组
  const records = ref<HistoryRecord[]>([]);
  // 当前路由索引
  const index = ref(0);
  // history变化方向, forward/backward
  const direction = ref<Direction>('');

  const routes = computed(() => {
    if (records.value.length > 0 && index.value <= records.value.length) {
      return records.value.slice(0, index.value + 1);
    }
    return [];
  });

  const tail: ComputedRef<HistoryRecord | undefined> = computed(() => {
    return records.value?.[records.value.length - 1];
  });

  function push(route: RouteLocationNormalizedLoaded) {
    if (route.fullPath === tail.value?.path) {
      return;
    }
    const record = createRecord(route);
    if (index.value + 1 < records.value.length) {
      records.value = records.value.slice(0, index.value + 1);
    }
    records.value.push(record);
    index.value = records.value.length - 1;
    direction.value = 'forward';
  }

  function replace(route: RouteLocationNormalizedLoaded) {
    const record = createRecord(route);
    if (index.value + 1 < records.value.length) {
      records.value = records.value.slice(0, index.value + 1);
    }
    records.value.pop();
    records.value.push(record);
    direction.value = 'forward';
  }

  function pop({ delta, path }: Partial<{ delta: number; path: string }>) {
    if (delta) {
      direction.value = delta > 0 ? 'forward' : 'backward';
      index.value += delta;
      index.value = Math.min(records.value.length, index.value);
      index.value = Math.max(0, index.value);
    } else {
      if (index.value > 0 && records.value[index.value - 1].path === path) {
        direction.value = 'backward';
        index.value -= 1;
      } else if (
        index.value < records.value.length - 1 &&
        records.value[index.value + 1].path === path
      ) {
        direction.value = 'forward';
        index.value += 1;
      }
    }
  }

  const keepAliveComponents = ref<string[]>([]);

  function setKeepAliveComponents(components: string[]) {
    keepAliveComponents.value = components;
  }

  return {
    records,
    index,
    direction,
    routes,
    push,
    replace,
    pop,
    keepAliveComponents,
    setKeepAliveComponents,
  };
});
