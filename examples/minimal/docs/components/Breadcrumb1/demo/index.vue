<template>
  <Breadcrumb :paths="paths" />
</template>

<script>
import { ref } from "vue";

export default {
  setup() {
    const handleClick = () => {
      alert('工作中心');
    }
    const paths = ref([
      { text: '产线' },
      { text: '工作中心', active: true, onClick: handleClick },
      { text: '工位' }
    ]);
    return {
      paths,
    };
  }
};
</script>
