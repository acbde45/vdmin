<template>
  <n-breadcrumb v-show="!!parentMenuOption || !$route.meta?.hideBreadcrumb">
    <n-breadcrumb-item>
      <n-dropdown :options="options" @select="handleSelect">
        <n-button class="vd-breadcrumb-dropdown-trigger" text type="priamry">
          {{ parentMenuOption?.label }}
          <n-icon :component="ChevronDown" />
        </n-button>
      </n-dropdown>
    </n-breadcrumb-item>
    <n-breadcrumb-item>
      <n-button text> {{ currentMenuOption?.label }} </n-button>
    </n-breadcrumb-item>
  </n-breadcrumb>
</template>

<script lang="ts" setup>
  import { ComputedRef } from 'vue';
  import { ChevronDown } from '@vicons/ionicons5';
  import { ProjectMenuOption, useSystemStore } from '@/stores/useSystemStore';

  const systemStore = useSystemStore();
  const route = useRoute();
  const router = useRouter();

  const parentMenuOption: ComputedRef<ProjectMenuOption | null> = computed(() => {
    const findParent = (
      code: string,
      menuOptions: ProjectMenuOption[]
    ): ProjectMenuOption | null => {
      let result: ProjectMenuOption | null = null;
      menuOptions.forEach((menuOption) => {
        if (menuOption?.children && !result) {
          if (
            menuOption?.children?.findIndex((childMenuOption) => childMenuOption.code === code) !==
            -1
          ) {
            result = menuOption;
          } else {
            result = findParent(code, menuOption.children);
          }
        }
      });
      return result;
    };

    if (!route.meta.code) return null;
    return findParent(route.meta.code as string, systemStore.menuOptions);
  });

  const otherMenuOptions: ComputedRef<ProjectMenuOption[]> = computed(() => {
    return (
      parentMenuOption.value?.children?.filter(
        (menuOption) => menuOption.code !== route.meta.code
      ) || []
    );
  });

  const currentMenuOption: ComputedRef<ProjectMenuOption | undefined> = computed(() => {
    return parentMenuOption.value?.children?.find(
      (menuOption) => menuOption.code === route.meta.code
    );
  });

  const options = computed(() => attachPropsToOptions(otherMenuOptions.value));

  function attachPropsToOptions(options: ProjectMenuOption[]) {
    return options.map((op) => ({
      ...op,
      props: {
        class: 'vd-breadcrumb-dropdown-option',
      },
    }));
  }

  function handleSelect(key: string | number) {
    const menuOption = otherMenuOptions.value.find((menuOption) => menuOption.code == key);
    if (menuOption?.route) {
      router.push(menuOption.route);
    }
  }
</script>

<style lang="scss">
  .vd-breadcrumb-dropdown-option {
    padding: 0 var(--vd-breadcrumb-dropdown-option-padding);
  }
</style>
