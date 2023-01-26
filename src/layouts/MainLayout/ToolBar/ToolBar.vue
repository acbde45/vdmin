<template>
  <div class="vd-toolbar">
    <ReloadTrigger />
    <BellTrigger />
    <TranslationTrigger />
    <FullscreenTrigger />
    <SettingTrigger />
    <UserControl />
  </div>
</template>

<script setup lang="ts">
  import {
    ReloadTrigger,
    BellTrigger,
    TranslationTrigger,
    FullscreenTrigger,
    SettingTrigger,
    UserControl,
  } from '.';
</script>

<style lang="scss">
  .vd-toolbar {
    @apply space-x-lg inline-flex items-center;
  }
</style>
