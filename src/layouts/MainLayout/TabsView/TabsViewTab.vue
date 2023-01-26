<template>
  <n-button
    ref="el"
    class="vd-tabsview-tab"
    secondary
    size="tiny"
    :type="active ? 'info' : 'default'"
    @click="navigateTo"
  >
    <template v-if="Icon">
      <Icon class="vd-tabsview-tab__icon" />
    </template>
    {{ title }}
    <n-icon
      v-if="closeable"
      class="vd-tabsview-tab__close-trigger"
      :component="CloseOutlined"
      @click.stop="emitCloseEvent"
    />
  </n-button>
</template>

<script setup lang="ts">
  import { ComponentPublicInstance, VNodeChild } from 'vue';
  import { RouteLocationRaw } from 'vue-router';
  import { CloseOutlined } from '@vicons/antd';
  import { renderMenuIcon } from '@/stores/useSystemStore';

  const { icon, route: tabRoute } = defineProps<{
    title: string;
    icon?: string;
    active?: boolean;
    closeable?: boolean;
    route: RouteLocationRaw;
  }>();
  const emit = defineEmits<{
    (event: 'init', offsetGetter: () => number | undefined): void;
    (event: 'close'): void;
  }>();

  const router = useRouter();
  const el = ref<ComponentPublicInstance | null>(null);
  const Icon = ref<() => VNodeChild>();

  watchEffect(() => {
    if (icon) {
      Icon.value = renderMenuIcon(icon);
    }
  });

  onMounted(() => {
    emit('init', () => el.value?.$el.offsetLeft);
  });

  function navigateTo() {
    router.push(tabRoute);
  }

  function emitCloseEvent() {
    emit('close');
  }
</script>

<style lang="scss">
  .vd-tabsview-tab {
    height: 24px;
    padding: 0 7px;

    .vd-tabsview-tab__icon {
      margin-right: 6px;
    }

    .vd-tabsview-tab__close-trigger {
      margin-left: 6px;
      width: 0;
      height: 0;
      border-radius: 50%;
      transform: scale(0.8);
      background-color: rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease-in-out;
      overflow: hidden;
    }

    &:hover {
      .vd-tabsview-tab__close-trigger {
        padding: 3px;
        width: 18px;
        height: 18px;
      }
    }
  }
</style>
