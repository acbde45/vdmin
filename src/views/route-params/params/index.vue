<template>
  params
  <n-input />
  <n-button @click="navigateToQuery">go query</n-button>
</template>

<script setup lang="ts">
  const router = useRouter();

  function navigateToQuery() {
    router.push('/route-params/query');
  }
</script>

<route lang="yaml">
meta:
  keepAlive: true
</route>
