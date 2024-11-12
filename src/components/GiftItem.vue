<script setup lang="ts">
import type {Action} from "@/types";
import {lc} from "@/locale";
import LottiePlayer from "@/components/LottiePlayer.vue";
import {f, formatQuantity} from "@/utils";
import UserAvatar from "@/components/UserAvatar.vue";
defineProps<{
  data: Action,
  isReceived: boolean,
}>()
</script>

<template>
<div class="GiftItem" :class="{_received: isReceived}">
  <UserAvatar class="GiftItem-avatar" size="tiny" v-if="isReceived" :user="data.target_user!"/>
  <div class="GiftItem-name" v-if="!isReceived">{{ data.gift!.name }}</div>
  <div class="GiftItem-animationWrap">
    <LottiePlayer :path="`/animations/gift-${data.gift!.animation}.json`" :play-algo="data.gift?.play_algo" />
<!--    <div class="GiftItem-animation"></div>-->
  </div>
  <div class="GiftItem-quantity" v-if="isReceived">{{ f(lc('pagination'), '1', formatQuantity(data.gift!.supply)) }}</div>
  <div class="GiftItem-nameBig" v-if="isReceived">{{ data.gift!.name }}</div>
  <button v-if="!isReceived" class="GiftItem-button">{{ lc('Send') }}</button>
</div>
</template>

<style lang="scss">
.GiftItem {
  cursor: pointer;
  padding-top: 8px;
  padding-bottom: 12px;
  border-radius: 12px;
  background-color: var(--theme-bg-secondary);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  .GiftItem-quantity {
    color: var(--theme-label-secondary);
    font-size: 12px;
    line-height: 18px;
    position: absolute;
    top: 8px;
    right: 12px;
  }
  .GiftItem-nameBig {
    font-size: 14px;
    font-weight: 500;
    line-height: 18px;
  }
  .GiftItem-avatar {
    position: absolute;
    top: 8px;
    left: 4px;
  }
  .GiftItem-name {
    color: var(--theme-label-secondary);
    font-size: 12px;
    line-height: 18px;
    margin-bottom: 4px;
  }
  .GiftItem-animationWrap {
    //width: calc(100% - 32px);
    //padding-bottom: calc(100% - 32px);
    width: 80px;
    height: 80px;
    margin: 0 16px;
    position: relative;
    .GiftItem-animation {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .GiftItem-button {
    padding: 6px 24px;
    font-weight: 600;
    border-radius: 30px;
    background-color: var(--theme-primary);
    font-size: 13px;
    line-height: 18px;
    color: var(--theme-white)
  }
  &._received {
    padding-top: 24px;
    padding-bottom: 12px;
  }
}
</style>
