<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import {hex2rgb, rgb2rgbaString} from "@/utils/color";
import type {Gift, LottiePlayerType} from "@/types";
import LottiePlayer from "@/components/LottiePlayer.vue";
import {lc} from "@/locale";
import {f, formatQuantity} from "@/utils";

function leftItemsText(): string {
  return f(lc('pagination'), props.data.purchased_count, formatQuantity(props.data.supply))
}

function buttonText(): string {
  return props.data.price + ' ' + props.data.asset
}

const props = defineProps<{
  data: Gift
}>()

const animationPlayer = useTemplateRef<LottiePlayerType>('animationPlayer')

const background = ref('')
const rgbColor = hex2rgb(props.data.color)
background.value = 'var(--pattern-url), linear-gradient(' + [rgb2rgbaString(rgbColor, 0.2), rgb2rgbaString(rgbColor, 0.1)].join(',') + ')';


</script>

<template>
  <div class="StoreGiftItem" :style="{backgroundImage: background}">
    <div class="StoreGiftItem-amount">{{ leftItemsText() }}</div>
    <div class="StoreGiftItem-animationWrap">
      <div class="StoreGiftItem-animation" @touchmove="animationPlayer!.play()" @mouseenter="animationPlayer!.play()">
        <LottiePlayer ref="animationPlayer" :autoplay="true" :path="`/animations/gift-${props.data.animation}.json`" :play-algo="props.data.play_algo"/>
      </div>
    </div>
    <div class="StoreGiftItem-name">{{ props.data.name }}</div>
    <button :class="{[data.asset.toLowerCase()]: true, _disabled: data.supply === data.purchased_count}" class="StoreGiftItem-button">
      <template v-if="data.supply !== data.purchased_count">{{ buttonText() }}</template>
      <template v-if="data.supply === data.purchased_count">{{lc('Sold')}}</template>
    </button>
  </div>
</template>

<style lang="scss">
.StoreGiftItem {
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  padding: 8px 0 16px;
  border-radius: 12px;
  position: relative;
  flex-direction: column;
  display: flex;
  align-items: center;
  .StoreGiftItem-animationWrap {
    position: relative;
    margin: 0 24px;
    width: calc(100% - 48px);
    height: 0;
    padding-bottom: calc(100% - 48px);
    .StoreGiftItem-animation {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .StoreGiftItem-amount {
    color: var(--theme-shop-item-stock);
    font-size: 13px;
    line-height: 18px;
    padding-right: 12px;
    width: 100%;
    text-align: right;
  }
  .StoreGiftItem-name {
    font-size: 17px;
    color: var(--theme-text);
    font-weight: 500;
    line-height: 22px;
  }
  .StoreGiftItem-button {
    margin-top: 12px;
    background-color: var(--theme-primary);
    color: white;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 30px;
    font-size: 13px;
    line-height: 18px;
    font-weight: 500;
    padding: 6px 16px 6px 34px;
    background-size: 20px;
    background-repeat: no-repeat;
    background-position: 12px center;
    &._usdt {background-image: var(--icon_usdt)}
    &._ton {background-image: var(--icon_ton)}
    &._eth {background-image: var(--icon_eth)}
    &._disabled {
      backdrop-filter: blur(3px);
      background-color: rgba(142, 142, 147, 0.1);
      color: var(--theme-label-secondary);
      padding: 6px 16px 6px 16px;
      background-image: none;
    }
  }
}
</style>
