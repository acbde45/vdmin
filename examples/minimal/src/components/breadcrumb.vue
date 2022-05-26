<script>
import { h } from "vue";

export default {
  name: "BreadCrumb",
  props: {
    paths: {
      type: Array,
      default: [],
    }
  },
  render() {
    const nodes = [];
    this.paths.formEach((path) => {
      const { active, text, ...props } = path;
      nodes.push(
        h(
          "li",
          {
            class: {
              'breadcrumb-item': true,
              active: path.active,
              ...props
            }
          },
          text
        )
      );
    });
    return h('ul', { class: 'breadcrumb' }, nodes);
  }
};
</script>

<style lang="scss" scoped>
.breadcrumb {
  display: flex;
  flex-wrap: wrap;
  padding: 12px;
  list-style: none;
  color: #505363;
  font-size: 14px;
  line-height: 1;
  .breadcrumb-item {
    &.active {
      color: #386bd7;
    }
    & + .breadcrumb-item {
      padding-left: 8px;
      &::before {
        padding-right: 8px;
        color: #505363;
        content: "/";
      }
    }
  }
}
</style>
