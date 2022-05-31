# Card

### 介绍

面包屑

## 代码演示

### 基本用法

<template>
  <Breadcrumb :paths="paths" />
</template>

<script setup>
import { ref } from "vue";

const paths = ref([{ text: '产线' }, { text: '工作中心', active: true }, { text: '工位' }]);
</script>


```html
<Breadcrumb :paths="paths" />
```

```js
import { ref } from "vue";

export default {
  setup() {
    const paths = ref([{ text: '产线' }, { text: '工作中心', active: true }, { text: '工位' }]);
    return {
      paths,
    };
  }
};
```

## API

### Props

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| paths | 面包屑路径 | _array_ | [] |