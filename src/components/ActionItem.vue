<script setup lang="ts">
import type {Action} from "@/types";
import UserAvatar from "@/components/UserAvatar.vue";
import {lc, lcP} from "@/locale";
import {ACTION_TYPE_PURCHASE, ACTION_TYPE_RECEIVE, ACTION_TYPE_SEND} from "../data";
import GiftAvatar from "@/components/GiftAvatar.vue";
import {fullName} from "../utils";
const props = defineProps<{
  type: 'user' | 'gift' | 'position',
  action: Action
  place?: number
}>()

function statusMsg(): string {
  if (props.type === 'user') {
    if (props.action.action_type === ACTION_TYPE_PURCHASE) {
      return lc('purchasing_gift')
    } else if (props.action.action_type === ACTION_TYPE_RECEIVE) {
      return lc('receiving_gift')
    } else if (props.action.action_type === ACTION_TYPE_SEND) {
      return lc('sending_gift')
    }
  } else if (props.type === 'gift') {
    if (props.action.action_type === ACTION_TYPE_PURCHASE) {
      return lc('status_purchased')
    } else if (props.action.action_type === ACTION_TYPE_RECEIVE) {
      return lc('status_received')
    } else if (props.action.action_type === ACTION_TYPE_SEND) {
      return lc('status_sent')
    }
  }
  return ''
}

function spentSum() {
  return '-' + props.action.gift?.price + ' ' + props.action.gift?.asset
}
</script>

<template>
<div class="ActionItem" :class="{_user: type === 'user', _gift: type === 'gift'}">
  <UserAvatar :action-type="action.action_type" :user="action.user!" size="medium" v-if="type !== 'gift'" />
  <GiftAvatar :gift-id-alias="action.gift!.animation" :action-type="action.action_type" v-if="type === 'gift'" />
  <div class="ActionItem-left">
    <div class="ActionItem-status" v-if="type !== 'position'">{{ statusMsg() }}</div>
    <div class="ActionItem-text">
      <template v-if="type === 'gift'">
        {{ action.gift!.name }}
      </template>
      <template v-if="type === 'user'">
        <template v-if="action.action_type === ACTION_TYPE_SEND">
          <router-link :to="`/profile/${action.user!.telegram_id}`">{{ fullName(action.user!) }}</router-link>
          {{ lc('sent a gift to') }}
          <router-link :to="`/profile/${action.target_user!.telegram_id}`">{{ fullName(action.target_user!) }}</router-link>
        </template>
        <template v-if="action.action_type === ACTION_TYPE_PURCHASE">
          <router-link :to="`/profile/${action.user!.telegram_id}`">{{ fullName(action.user!) }}</router-link> {{lc('bought_a_gift') }}
        </template>
      </template>
      <template v-if="type === 'position'">
        {{fullName(action.user!)}}
      </template>
    </div>
    <div v-if="type === 'position'" class="ActionItem-giftsCount">{{ lcP('gifts_count', action.user!.received_count, true) }}</div>
    <div class="ActionItem-separator"></div>
  </div>
  <div v-if="type !== 'user'" class="ActionItem-right" :class="{_place: type === 'position', _gold: place === 1, _silver: place === 2, _bronze: place === 3}">
    <template v-if="type === 'position' && place !== 1 && place !== 2 && place !== 3">
      #{{place}}
    </template>
    <template v-if="type === 'gift'">
      <template v-if="action.action_type === ACTION_TYPE_PURCHASE">
        {{ spentSum() }}
      </template>
      <template v-if="action.action_type === ACTION_TYPE_SEND">
        {{ lc('dst_to') }}<router-link :to="'/profile/' + action.user!.telegram_id">{{ fullName(action.user!) }}</router-link>
      </template>
      <template v-if="action.action_type === ACTION_TYPE_RECEIVE">
        {{ lc('dst_from') }}<router-link :to="'/profile/' + action.user!.telegram_id">{{ fullName(action.user!) }}</router-link>
      </template>
    </template>
  </div>
</div>
</template>

<style>
.ActionItem-giftsCount {
  background-image: var(--icon_gift_small);
  background-size: 12px;
  background-repeat: no-repeat;
  background-position: center left;
  color: var(--theme-primary);
  font-size: 13px;
  line-height: 16px;
  padding-left: 18px;
}
.ActionItem {
  display: flex;
  padding: 8px 16px;
  position: relative;
  align-items: center;
  .Avatar, .GiftAvatar {
    flex-shrink: 0;
  }
  .ActionItem-separator {
    position: absolute;
    width: calc(100% - 84px);
    background-color: var(--theme-separator);
    transform: scaleY(var(--separator-scale));
    transform-origin: top center;
    height: 1px;
    top: 0;
    right: 16px;
  }
  &:first-child, &._noSeparator {
    .ActionItem-separator {
      display: none;
    }
  }
  &._user {
    padding-top: 12px;
    padding-bottom: 12px;
    height: 64px;
  }
  .ActionItem-left {
    flex: 1;
    margin-left: 12px;
    overflow-x: auto;
    .ActionItem-status {
      font-size: 13px;
      line-height: 16px;
      color: var(--theme-label-secondary)
    }
    .ActionItem-text {
      padding-top: 2px;
      font-size: 17px;
      line-height: 22px;
      font-weight: 500;
      white-space: nowrap;
    }
  }

  .ActionItem-right {
    font-family: var(--font-sf-pro), sans-serif;
    &._place {
      font-weight: 500;
      color: var(--theme-label-secondary);
      font-size: 15px;
      line-height: 22px;
    }
    &._gold, &._silver, &._bronze {
      width: 24px;
      height: 24px;
      background-repeat: no-repeat;
      background-size: 24px;
    }
    &._gold {
      background-image: var(--icon_gold);
    }
    &._silver {
      background-image: var(--icon_silver);
    }
    &._bronze {
      background-image: var(--icon_bronze);
    }
  }

  &._user {
    .ActionItem-text {
      font-family: var(--font-sf-pro), sans-serif;
    }
  }
}
</style>
