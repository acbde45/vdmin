<template>
  <div
    :class="['vdmin-doc-simulator', { 'vdmin-doc-simulator-fixed': isFixed }]"
  >
    <iframe ref="iframe" :src="src" :style="simulatorStyle" frameborder="0" />
  </div>
</template>

<script>
export default {
  name: "Simulator",

  props: {
    src: String,
  },

  data() {
    return {
      scrollTop: window.scrollY,
      windowHeight: window.innerHeight,
    };
  },

  computed: {
    isFixed() {
      return this.scrollTop > 60;
    },

    simulatorStyle() {
      const height = Math.min(640, this.windowHeight - 90);
      return {
        height: height + "px",
      };
    },
  },

  mounted() {
    window.addEventListener("scroll", () => {
      this.scrollTop = window.scrollY;
    });
    window.addEventListener("resize", () => {
      this.windowHeight = window.innerHeight;
    });
  },
};
</script>

<style lang="scss">
@use "sass:math";

@import "../../common/style/var.scss";

.vdmin-doc-simulator {
  position: absolute;
  top: $--vdmin-doc-padding + $--vdmin-doc-header-top-height;
  right: $--vdmin-doc-padding;
  z-index: 1;
  box-sizing: border-box;
  width: $--vdmin-doc-simulator-width;
  min-width: $--vdmin-doc-simulator-width;
  overflow: hidden;
  background: #fafafa;
  border-radius: $--vdmin-doc-border-radius;
  box-shadow: 0 8px 12px #ebedf0;

  @media (max-width: 1100px) {
    right: auto;
    left: 750px;
  }

  &-fixed {
    position: fixed;
    top: $--vdmin-doc-padding;
  }

  iframe {
    display: block;
    width: 100%;
  }
}
</style>
