<template>
  <div class="vd-tabsview">
    <n-button class="vd-tabsview__left-arrow" text @click="scrollToPrev">
      <template #icon>
        <n-icon :component="LeftOutlined" />
      </template>
    </n-button>
    <div class="vd-tabsview__tabs">
      <n-scrollbar ref="scrollbar" x-scrollable trigger="none" @scroll="handleScrollThrottle">
        <Draggable :list="tabs" item-key="key" :animation="200">
          <template #item="{ element: tab }">
            <TabsViewTab
              :key="tab.key"
              :active="tab.key === activeKey"
              :title="tab.title || ''"
              :closeable="!tab.affix"
              :icon="tab.icon"
              :route="tab.path"
              @init="recordTabWidth(tab, $event)"
              @close="removeTab(tab)"
            />
          </template>
        </Draggable>
      </n-scrollbar>
    </div>
    <n-button class="vd-tabsview__right-arrow" text @click="scrollToNext">
      <template #icon>
        <n-icon :component="RightOutlined" />
      </template>
    </n-button>
    <TabsViewMenu />
  </div>
</template>

<script setup lang="ts">
  import { NScrollbar } from 'naive-ui';
  import Draggable from 'vuedraggable';
  import { RightOutlined, LeftOutlined } from '@vicons/antd';
  import { createTabItem, TabItem, useTabsViewStore } from '@/stores/useTabsViewStore';
  import { useHistoryStore } from '@/stores/useHistoryStore';
  import { TABS_ROUTES } from '@/stores/mutationTypes';
  import { PageEnum } from '@/enums/pageEnum';
  import { storage } from '@/utils/Storage';
  import { PAGE_WHITE_LIST } from '@/router/constant';
  import { Pojo } from '#types/utils';
  import TabsViewTab from './TabsViewTab.vue';
  import TabsViewMenu from './TabsViewMenu.vue';

  const route = useRoute();
  const router = useRouter();
  const message = useMessage();
  const tabsViewStore = useTabsViewStore();
  const historyStore = useHistoryStore();

  const scrollbar = ref<InstanceType<typeof NScrollbar> | null>(null);
  const scrollLeft = ref(0);
  const tabsWidths = reactive(new Map<Pojo, () => number | undefined>());
  const curTabIdx = ref(0);
  const lock = ref(false);
  const activeKey = ref<string>();

  // 标签页列表
  const tabs = computed(() => tabsViewStore.tabs);

  watch(
    () => route.fullPath,
    (to) => {
      if (PAGE_WHITE_LIST.includes(route.name as PageEnum)) return;
      activeKey.value = to;
      tabsViewStore.addTabs(createTabItem(route));
    },
    { immediate: true }
  );

  // 在页面关闭或刷新之前，保存最新的标签页记录
  window.addEventListener('beforeunload', () => {
    storage.set(TABS_ROUTES, JSON.stringify(tabs.value));
  });

  onBeforeMount(() => {
    // 初始化
    activeKey.value = route?.fullPath;
    tabsViewStore.initTabs(createTabItem(route));
  });

  /**
   * 处理滚动条滚动事件
   */
  function handleScroll(e: Event) {
    if (lock.value) {
      lock.value = false;
      return;
    }
    scrollLeft.value = (e.target as Element)?.scrollLeft;
    let curIdx = 0;
    while (scrollLeft.value > (tabsWidths.get(tabs.value[curIdx])?.() || 0)) {
      curIdx += 1;
    }
    curTabIdx.value = curIdx;
  }
  const handleScrollThrottle = useThrottleFn(handleScroll);

  /**
   * 记录每个tab对应的dom元素的offsetLeft
   */
  function recordTabWidth(tab: Pojo, offsetGetter: () => number | undefined) {
    tabsWidths.set(tab, offsetGetter);
  }

  /**
   * 滚动到上一个tab的位置
   */
  function scrollToPrev() {
    const prevTab = tabs.value[curTabIdx.value - 1];
    if (scrollbar.value && prevTab) {
      lock.value = true;
      scrollbar.value.scrollTo({
        left: tabsWidths.get(prevTab)?.() || 0,
        behavior: 'smooth',
      });
      curTabIdx.value = curTabIdx.value - 1;
    }
  }

  /**
   * 滚动到下一个tab的位置
   */
  function scrollToNext() {
    const nextTab = tabs.value[curTabIdx.value + 1];
    if (scrollbar.value && nextTab) {
      lock.value = true;
      const scrollbarCont = scrollbar.value.scrollbarInstRef?.containerRef;
      // 滚动到底curTabIdx不应该再增加了
      if (
        scrollbarCont &&
        Math.ceil(scrollbarCont.clientWidth + scrollbarCont.scrollLeft + 1) >=
          scrollbarCont.scrollWidth
      ) {
        // 防止最后一项hover的时候close图标被遮挡
        scrollbar.value.scrollTo({
          left: (tabsWidths.get(nextTab)?.() || 0) + 20,
          behavior: 'smooth',
        });
      } else {
        scrollbar.value.scrollTo({
          left: tabsWidths.get(nextTab)?.() || 0,
          behavior: 'smooth',
        });
        curTabIdx.value = curTabIdx.value + 1;
      }
    }
  }

  /**
   * 移除缓存组件名称
   */
  function delKeepAliveCompName() {
    if (route.meta.keepAlive) {
      const name = router.currentRoute.value.matched.find((item) => item.name == route.name)
        ?.components?.default.name;

      if (name) {
        historyStore.setKeepAliveComponents(
          historyStore.keepAliveComponents.filter((item) => item !== name)
        );
      }
    }
  }

  /**
   * 关闭当前页面
   */
  function removeTab(route: TabItem) {
    if (tabs.value.length === 1) {
      return message.warning('这已经是最后一页，不能再关闭了！');
    }
    delKeepAliveCompName();
    tabsViewStore.closeCurrentTab(route);
    // 如果关闭的是当前页
    if (activeKey.value === route.key) {
      const currentRoute = tabs.value[Math.max(0, tabs.value.length - 1)];
      activeKey.value = currentRoute.key;
      router.push(currentRoute);
    }
  }
</script>

<style lang="scss">
  .vd-tabsview {
    @apply w-full flex items-center;
    height: var(--vd-layout-tabsview-height);
    background: var(--n-color);
    box-shadow: var(--vd-layout-tabsview-shadow);

    .vd-tabsview__tabs {
      @apply flex w-full overflow-hidden;
      transition: width 0.3s var(--n-bezier);
      height: 24px;

      .n-scrollbar-content {
        @apply whitespace-nowrap;

        .vd-tabsview-tab {
          --tw-space-x-reverse: 0;
          margin-right: calc(8px * var(--tw-space-x-reverse));
          margin-left: calc(8px * calc(1 - var(--tw-space-x-reverse)));

          &:last-child {
            margin-right: 20px;
          }
        }
      }

      .n-scrollbar-rail {
        @apply hidden;
      }
    }

    .vd-tabsview__left-arrow,
    .vd-tabsview__right-arrow {
      @apply mx-sm;
    }

    .vd-tabsview__right-arrow {
      @apply mr-0;
    }
  }
</style>
