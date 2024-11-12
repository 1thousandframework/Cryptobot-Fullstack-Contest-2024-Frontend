<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import LottiePlayer from "@/components/LottiePlayer.vue";

const visible = ref(false)

const title = ref('')
const subtitle = ref('')
const playAlgo = ref('')
const animationName = ref('')
const btnText = ref('')
const btnHandler = ref<null | (() => void)>(null)

const toast = useTemplateRef('toast')
let timeout: number | undefined;

function close() {
  clearTimeout(timeout)
  toast.value?.classList.add('Toast_hide')
}

defineExpose({
  show: (newAnimationName: string, animationAlgo: string, newTitle: string, newSubtitle: string, newBtnText: string, newBtnHandler: () => void) => {
    title.value = newTitle
    subtitle.value = newSubtitle
    playAlgo.value = animationAlgo
    animationName.value = newAnimationName
    btnText.value = newBtnText
    btnHandler.value = newBtnHandler
    visible.value = true
    toast.value?.classList.add('Toast_show')
    timeout = setTimeout(() => {
      close()
    }, 3250)
  },
  hide: () => {
    close()
  }
})

function animationEnd(event: AnimationEvent) {
  if (event.animationName === 'toastHide') {
    toast.value?.classList.remove('Toast_show', 'Toast_hide')
  }
}

function onBtnClick() {
  if (btnHandler.value) {
    btnHandler.value()
  }
  close()
}
</script>

<template>
<div @animationend="animationEnd($event)" class="Toast" ref="toast">
  <div class="Toast-animationWrap">
    <div class="Toast-animation">
      <LottiePlayer v-if="animationName !== ''" :play-algo="playAlgo" :path="`/animations/${animationName}.json`"  />
    </div>
  </div>
  <div class="Toast-textWrap">
    <div class="Toast-title">{{ title }}</div>
    <div class="Toast-subtitle">{{ subtitle }}</div>
  </div>
  <button @click="onBtnClick" class="Toast-button">{{ btnText }}</button>
</div>
</template>

<style lang="scss">

.Toast {
  display: none;
  position: fixed;
  bottom: 16px;
  left: 16px;
  width: calc(100% - 32px);
  font-family: var(--font-sf-pro), sans-serif;
  border-radius: 14px;
  background-color: var(--theme-notification-bg);
  color: var(--theme-white);
  padding: 8px 16px;
  align-items: center;
  animation-timing-function: ease-in;
  animation-fill-mode: forwards;
  min-height: 54px;
  .Toast-animationWrap {
    width: 26px;
    height: 26px;
    margin-right: 12px;
    position: relative;
    .Toast-animation {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .Toast-textWrap {
    flex: 1;
    padding-right: 12px;
    color: var(--theme-white);
    .Toast-title {
      font-size: 14px;
      line-height: 18px;
      font-weight: 500;
    }
    .Toast-subtitle {
      font-size: 14px;
      line-height: 18px;
    }
  }
  .Toast-button {
    color: var(--theme-cyan);
    font-size: 17px;
    line-height: 22px;
    padding: 0;
  }
}

@keyframes toastShow {
  from {
    top: 100%;
  }
  to {
    top: calc(100% - 70px);
  }
}
@keyframes toastHide {
  from {
    top: calc(100% - 70px);
    transform: scale(1);
    opacity: 1;
  }
  to {
    top: calc(100% - 70px);
    transform: scale(0.75);
    opacity: 0;
  }
}
.Toast_show {
  display: flex;
  animation-duration: 0.2s;
  animation-timing-function: ease-out;
  animation-name: toastShow;
}
.Toast_hide {
  animation-duration: 0.2s;
  animation-timing-function: ease-in;
  animation-name: toastHide;
}
</style>
