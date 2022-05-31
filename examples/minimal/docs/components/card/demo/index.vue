<template>
  <Breadcrumb :paths="paths" />
  <VanButton @click="toast">Card</VanButton>
</template>

<script>
import { Toast } from "vant";
import { ref } from "vue";

export default {
  setup() {
    const handleClick = () => {
      alert('工作中心');
    }
    const paths = ref([
      { text: '产线' },
      { text: '工作中心', active: true, onClick: handleClick },
    ]);

    const toast = () => {
      Toast.success('第二个 Toast');
    };
    return {
      paths,
      toast,
    };
    
  }
};
</script>
