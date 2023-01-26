<template></template>

<script lang="ts">
  import { useHistoryStore } from '@/stores/useHistoryStore';

  export default defineComponent({
    beforeRouteEnter: (to, from, next) => {
      const historyStore = useHistoryStore();
      next((vm) => {
        const { params, query } = vm.$route;
        const { path } = params;

        vm.$router
          .replace({
            path: '/' + (Array.isArray(path) ? path.join('/') : path),
            query,
          })
          .then(() => {
            const name = vm.$route.matched.find((item) => item.name == from.name)?.components
              ?.default.name;
            if (name) {
              historyStore.keepAliveComponents.push(name);
            }
          });
      });
    },
  });
</script>
