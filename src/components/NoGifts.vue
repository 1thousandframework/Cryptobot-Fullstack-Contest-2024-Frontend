<script setup lang="ts">
import {lc} from "@/locale";
import LottiePlayer from "@/components/LottiePlayer.vue";
defineProps<{
  text: string
  animationPath: string
}>()
</script>

<template>
<div class="NoGifts">
  <div class="NoGifts-img">
    <LottiePlayer :path="animationPath"/>
  </div>
  <div class="NoGifts-msg">{{ text }}</div>
  <RouterLink class="NoGifts-goToStore" to="/">{{ lc('Open Store') }}</RouterLink>
</div>
</template>

<style>
.NoGifts {
  background-color: var(--theme-bg-secondary);
  padding: 32px;
  display: flex;
  align-items: center;
  flex-direction: column;
  border-radius: 12px;
  .NoGifts-msg {
    font-size: 17px;
    line-height: 22px;
    padding: 16px 0;
    text-align: center;
  }
  .NoGifts-img {
    position: relative;
    width: 100px;
    height: 100px;
    background-repeat: no-repeat;
    background-size: 100px;
  }
  .NoGifts-goToStore {
    font-size: 17px;
    line-height: 22px;
  }
}
</style>
