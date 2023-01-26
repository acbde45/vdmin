<template>
  <n-loading-bar-provider>
    <n-dialog-provider>
      <n-message-provider>
        <n-notification-provider>
          <router-view />
        </n-notification-provider>
      </n-message-provider>
    </n-dialog-provider>
  </n-loading-bar-provider>
</template>

<style lang="scss">
  html,
  body,
  #app {
    height: 100%;
    width: 100%;
  }

  html {
    font-size: 16px;
  }
</style>
