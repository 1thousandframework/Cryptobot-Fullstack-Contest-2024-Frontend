<script setup lang="ts">
import type {ActionType} from "@/types";
import {ACTION_TYPE_PURCHASE, ACTION_TYPE_RECEIVE, ACTION_TYPE_SEND} from "@/data";
import AvatarStatus from "@/components/AvatarStatus.vue";

defineProps<{
  actionType: ActionType,
  giftIdAlias: string
}>()
</script>

<template>
<div class="GiftAvatar" :style="{backgroundImage: 'var(--icon_gift_' + giftIdAlias + ')'}" :class="{
  _received: actionType === ACTION_TYPE_RECEIVE,
  _sent: actionType === ACTION_TYPE_SEND,
  _purchased: actionType === ACTION_TYPE_PURCHASE
}">
  <AvatarStatus />
</div>
</template>

<style lang="scss">
.GiftAvatar {
  background-size: 30px;
  background-repeat: no-repeat;
  background-position: center;
  background-color: var(--theme-bg-secondary);
  border-radius: 10px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 40px;
  //.GiftAvatar-img {
  //  width: 30px;
  //  height: 30px;
  //}
  //.GiftAvatar-status, .Gift-Avatar-statusStroke {
  //  width: 16px;
  //  height: 16px;
  //  border-radius: 50%;
  //  position: absolute;
  //  right: -2px;
  //  bottom: 1px;
  //  background-size: 16px;
  //}
  //.Gift-Avatar-statusStroke {
  //  transform: scale(1.0625);
  //  background-color: var(--theme-bg);
  //}
  //&._received {
  //  .GiftAvatar-status {
  //    background-image: var(--icon_status_received);
  //    background-color: var(--theme-green);
  //  }
  //}
  //&._sent {
  //  .GiftAvatar-status {
  //    background-image: var(--icon_status_sent);
  //    background-color: var(--theme-purple);
  //  }
  //}
  //&._purchased {
  //  .GiftAvatar-status {
  //    background-image: var(--icon_status_purchased);
  //    background-color: var(--theme-blue);
  //  }
  //}
}
</style>
