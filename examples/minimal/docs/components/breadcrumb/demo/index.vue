<template>
  <BreadCrumb :paths="paths" />
</template>

<script setup>
import { ref } from "vue";

const paths = ref([{ text: '产线' }, { text: '工作中心', active: true }, { text: '工位' }]);
</script>
