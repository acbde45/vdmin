<template>
  <n-spin :show="loading">
    <div class="vd-iframe-wrapper">
      <iframe :src="frameSrc" class="vd-iframe" ref="frameRef"></iframe>
    </div>
  </n-spin>
</template>

<script lang="ts" setup>
  import { ref, unref, onMounted, nextTick } from 'vue';
  import { useRoute } from 'vue-router';

  const currentRoute = useRoute();
  const loading = ref(false);
  const frameRef = ref<HTMLIFrameElement | null>(null);
  const frameSrc = ref<string>('');

  if (unref(currentRoute.meta)?.frameSrc) {
    frameSrc.value = unref(currentRoute.meta)?.frameSrc as string;
  }

  function hideLoading() {
    loading.value = false;
  }

  function init() {
    nextTick(() => {
      const iframe = unref(frameRef);
      if (!iframe) return;
      const _frame = iframe as any;
      if (_frame.attachEvent) {
        _frame.attachEvent('onload', () => {
          hideLoading();
        });
      } else {
        iframe.onload = () => {
          hideLoading();
        };
      }
    });
  }

  onMounted(() => {
    loading.value = true;
    init();
  });
</script>

<style lang="scss">
  .vd-iframe-wrapper {
    width: 100%;
    height: 100vh;

    .vd-iframe {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: 0;
      box-sizing: border-box;
    }
  }
</style>
