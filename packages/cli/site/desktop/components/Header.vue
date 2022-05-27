<template>
  <div class="vdmin-doc-header">
    <div class="vdmin-doc-row">
      <div class="vdmin-doc-header__top">
        <a class="vdmin-doc-header__logo">
          <img :src="config.logo" />
          <span class="vdmin-doc-header__title">{{ config.title }}</span>
          <span v-if="config.subtitle" class="vdmin-doc-header__subtitle">
            {{ config.subtitle }}
          </span>
        </a>

        <ul class="vdmin-doc-header__top-nav">
          <li
            v-for="(item, index) in config.links"
            :key="index"
            class="vdmin-doc-header__top-nav-item"
          >
            <a class="vdmin-doc-header__link" target="_blank" :href="item.url">
              <img v-if="item.logo" :src="item.logo" />
              <span v-else-if="item.text">
                {{ item.text }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Header',

  props: {
    config: Object,
  },

};
</script>

<style lang="scss">
@import '../../common/style/var.scss';

.vdmin-doc-header {
  width: 100%;
  background-color: #001938;
  user-select: none;

  &__top {
    display: flex;
    align-items: center;
    height: $--vdmin-doc-header-top-height;
    padding: 0 $--vdmin-doc-padding;

    &-nav {
      flex: 1;
      font-size: 0;
      text-align: right;

      > li {
        position: relative;
        display: inline-block;
        vertical-align: middle;
      }

      &-item {
        margin-left: 16px;
      }

      &-title {
        display: block;
        font-size: 15px;
      }
    }
  }

  &__cube {
    position: relative;
    display: block;
    padding: 0 12px;
    color: #001938;
    background: #f7f8fa;
    font-size: 14px;
    line-height: 30px;
    text-align: center;
    border: 1px solid rgba(255, 255, 255, 0.7);
    border-radius: 20px;
    cursor: pointer;
    transition: 0.3s ease-in-out;
  }

  &__version {
    padding-right: 20px;

    &::after {
      position: absolute;
      top: 10px;
      right: 9px;
      width: 5px;
      height: 5px;
      color: #001938;
      border: 1px solid;
      border-color: transparent transparent currentColor currentColor;
      transform: rotate(-45deg);
      content: '';
    }

    &-pop {
      position: absolute;
      top: 34px;
      left: 0;
      width: 100%;
      z-index: 99;
      color: #333;
      line-height: 36px;
      text-align: left;
      overflow: hidden;
      background-color: #fff;
      border-radius: 8px;
      box-shadow: 0 4px 12px #ebedf0;
      transform-origin: top;
      transition: 0.2s cubic-bezier(0.215, 0.61, 0.355, 1);

      &-item {
        padding-left: 12px;
        transition: 0.2s;

        &:hover {
          color: $--vdmin-doc-blue;
          background-color: #f7f8fa;
        }
      }
    }
  }

  &__logo {
    display: block;

    img {
      display: inline-block;
      width: 28px;
      margin-right: 12px;
      vertical-align: middle;
    }
  }

  &__title {
    display: inline-block;
    color: #fff;
    font-size: 22px;
    vertical-align: middle;
  }

  &__subtitle {
    display: inline-block;
    color: #999;
    margin-left: 4px;
    vertical-align: -4px;
    font-size: 13px;
  }

  &__link {
    span {
      color: #fff;
      font-size: 16px;
    }

    img {
      display: block;
      width: 30px;
      height: 30px;
      transition: 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);

      &:hover {
        transform: scale(1.2);
      }
    }
  }
}

.vdmin-doc-dropdown {
  &-enter,
  &-leave-active {
    transform: scaleY(0);
    opacity: 0;
  }
}
</style>
