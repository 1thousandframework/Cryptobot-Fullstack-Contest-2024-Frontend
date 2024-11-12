<script setup lang="ts">
import {onMounted, useTemplateRef} from "vue";
import {useRoute} from "vue-router";
import router from "@/router";
import LottiePlayer from "@/components/LottiePlayer.vue";
import type {LottiePlayerType} from "@/types";
const route = useRoute();

const props = defineProps<{
  text: string,
  icon: string,
  path: string,
}>()

const animationPlayer = useTemplateRef<LottiePlayerType>('animationPlayer')
const textEl = useTemplateRef('textEl')

onMounted(() => {
  textEl.value!.addEventListener('animationend', (event: AnimationEvent) => {
    if (event.animationName === 'NavBarText') {
      textEl.value!.classList.remove('_anim')
    }
  })
})

function onClick() {
  animationPlayer.value!.play();
  textEl.value!.classList.add('_anim')
  router.replace({ path: props.path })
}

</script>

<template>
  <button :class="{ _active: route.path === path }" class="NavigationBarButton" @click="onClick()">
    <span class="NavigationBarButton-icon">
      <LottiePlayer ref="animationPlayer" renderer="svg" :path="`/animations/tab-${props.icon}.json`" :autoplay="false"/>
    </span>
    <span ref="textEl" class="NavigationBarButton-text">{{ text }}</span>
  </button>
</template>

<style lang="scss">
@keyframes NavBarText {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(0.9);
  }
  100% {
    transform: scale(1);
  }
}
.NavigationBarButton {
  flex: 1;
  padding: 12px 4px 4px;
  box-sizing: border-box;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  &._active {
    .NavigationBarButton-icon path {
      fill: var(--theme-primary);
    }
    .NavigationBarButton-text {
      color: var(--theme-primary);
    }
  }
  &::before {
    position: absolute;
    width: 100%;
    height: 100%;
  }
  .NavigationBarButton-icon {
    width: 26px;
    height: 26px;
    display: block;
    overflow: hidden;
    path {
      transition: 0.2s ease-in fill;
      fill: var(--theme-tab-bar-icon);
    }
  }
  .NavigationBarButton-text {
    display: block;
    color: var(--theme-tab-bar-label);
    transition: 0.2s ease-in color;
    padding-top: 4px;
    font-size: 10px;
    text-align: center;
    transform-origin: top;
    animation-duration: 0.2s;
    animation-timing-function: ease-in;
    animation-fill-mode: forwards;
    &._anim {
      animation-name: NavBarText;
    }
  }
  @media (hover: hover) {
    &:hover {
      .NavigationBarButton-icon path {
        fill: var(--theme-primary);
      }
      .NavigationBarButton-text {
        color: var(--theme-primary);
      }
    }
  }
}
</style>
