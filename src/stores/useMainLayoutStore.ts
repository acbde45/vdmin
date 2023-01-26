export enum LayoutMode {
  FIXED_TOP_BAR = 1 << 0,
  FIXED_SIDE_BAR = 2 << 0,
}

export const useMainLayoutStore = defineStore('mainLayout', () => {
  const collapsed = ref(false);
  const lock = ref(true);
  const layoutMode = ref<LayoutMode>(LayoutMode.FIXED_TOP_BAR);

  function toggleSideBar() {
    collapsed.value = !collapsed.value;
  }

  function toggleLock() {
    lock.value = !lock.value;
    collapsed.value = !lock.value;
  }

  function changeLayoutMode(mode: LayoutMode) {
    layoutMode.value = mode;
  }

  return { collapsed, toggleSideBar, lock, toggleLock, layoutMode, changeLayoutMode };
});
