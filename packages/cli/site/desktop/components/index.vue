<template>
  <Header :config="config" />
  <Nav :nav-config="config.nav" />
  <Container :has-simulator="hasSimulator">
    <Content>
      <slot />
    </Content>
  </Container>
  <Simulator v-if="hasSimulator" :src="simulator" />
</template>

<script>
import Header from './Header.vue';
import Nav from './Nav.vue';
import Container from './Container.vue';
import Content from './Content.vue';
import Simulator from './Simulator.vue';

export default {
  name: 'DocRoot',

  components: {
    Header,
    Nav,
    Container,
    Content,
    Simulator,
  },

  props: {
    simulator: String,
    hasSimulator: Boolean,
    config: {
      type: Object,
      required: true,
    },
    base: {
      type: String,
      default: '',
    },
  }
};
</script>