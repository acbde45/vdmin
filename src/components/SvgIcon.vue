<template>
  <svg width="100%" height="100%" aria-hidden="true">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<script lang="ts">
  export default defineComponent({
    name: 'SvgIcon',
    props: {
      prefix: {
        type: String,
        default: 'icon',
      },
      name: {
        type: String,
        required: true,
      },
      color: {
        type: String,
        default: '#333',
      },
    },
    setup(props) {
      const symbolId = computed(() => `#${props.prefix}-${props.name}`);
      return { symbolId };
    },
  });
</script>
