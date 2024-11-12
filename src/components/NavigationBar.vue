<script setup lang="ts">
import NavigationBarButton from "@/components/NavigationBarButton.vue";
import {lc} from "@/locale";
import MiniApp from "@/helpers/MiniAppHelper";
import {useTemplateRef} from "vue";

const navbar = useTemplateRef<HTMLDivElement>('navbar')

defineExpose({
  show: () => {
    navbar.value!.classList.remove('_hide')
  },
  hide: () => {
    navbar.value!.classList.add('_hide')
  },
})
</script>

<template>
  <div class="NavigationBar" ref="navbar">
    <div class="NavigationBar-topLine"></div>
    <div class="NavigationBar-buttons">
      <NavigationBarButton path="/" icon="store" :text="lc('Store')" />
      <NavigationBarButton path="/gifts" icon="gifts" :text="lc('Gifts')" />
      <NavigationBarButton path="/leaderboard" icon="leaderboard" :text="lc('Leaderboard')" />
      <NavigationBarButton :path="'/profile/' + MiniApp.initDataUnsafe.user?.id" icon="profile" :text="lc('Profile')" />
    </div>
  </div>
</template>

<style lang="scss">
  .NavigationBar {
    position: relative;
    height: 58px;
    transition: 0.3s ease height, 0.3s ease opacity;
    opacity: 1;
    .NavigationBar-topLine {
      pointer-events: none;
      height: 1px;
      width: 100%;
      background-color: var(--theme-separator);
      transform: scaleY(var(--separator-scale));
      transform-origin: bottom center;
      position: absolute;
      top: -1px;
    }
    .NavigationBar-buttons {
      position: absolute;
      top: 0;
      width: 100%;
      height: 58px;
      background-color: var(--theme-tab-bar);
      overflow: hidden;
      display: flex;
      justify-content: space-around;
    }
    &._hide {
      height: 0px;
      opacity: 0;
    }
  }
</style>
