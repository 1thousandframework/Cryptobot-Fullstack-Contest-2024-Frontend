<script setup lang="ts">
import {inject, type Ref, ref} from "vue";
import type {Action, BottomSheetType, TheToastType, User} from "@/types";
import {getUser} from "@/data";
import {useRoute} from "vue-router";
import {curLang, lc, lcP, loadLang, locales} from "@/locale";
import NoGifts from "@/components/NoGifts.vue";
import {WebAppUser} from "@/helpers/MiniAppHelper";
import UserAvatar from "@/components/UserAvatar.vue";
import APIHelper from "@/helpers/APIHelper";
import {ACTIONS_PER_RESULT} from "@/config";
import GiftItem from "@/components/GiftItem.vue";
import {fullName} from "../utils";
import SwitchToggle from "@/components/SwitchToggle.vue";
import {curTheme} from "@/helpers/ThemeHelper";
const route = useRoute()
const bottomSheet = inject('bottomSheet') as Ref<BottomSheetType>

let canLoadMore = true
let loading = false
const ready = ref(false)
const receivedGifts = ref<Action[]>([])

let offset = 0
function loadData() {
  if (loading) return
  loading = true
  APIHelper.getReceivedGifts(Number(route.params.id!), offset).then(actions => {
    if (actions instanceof Error) {

    } else {
      if (actions.length < ACTIONS_PER_RESULT) {
        canLoadMore = false
      }
      receivedGifts.value.push(...actions)
    }
    offset += ACTIONS_PER_RESULT
  }).finally(() => {
    ready.value = true
    loading = false
  })
}
loadData()

const place = ref<number | null>(null)
APIHelper.getUserPlace(Number(route.params.id!)).then(maybePlace => {
  if (typeof maybePlace === 'number') {
    place.value = maybePlace
  }
})

const user = ref<User | null>(null)
getUser(Number(route.params.id!)).then(maybeUser => {
  if (maybeUser instanceof Error) {

  } else if (maybeUser === null) {

  } else {
    user.value = maybeUser
  }
})

function onScroll(event: Event) {
  const target = event.target as HTMLDivElement
  if ((target.scrollTop + target.offsetHeight > target.scrollHeight - 100) && canLoadMore) {
    loadData()
  }
}

function onThemeChange(isDark: boolean) {
  if (isDark) {
    curTheme.value = 'dark'
  } else {
    curTheme.value = 'light'
  }
}

async function onLangChange(isRu: boolean) {
  let newLang = ''
  if (isRu) {
    newLang = 'ru'
  } else {
    newLang = 'em'
  }
  loadLang(newLang)
}
</script>

<template>
<div v-if="user" class="Page PageProfile" @scroll="onScroll">
  <div class="PageProfile-avatarWrap">
    <SwitchToggle v-if="user.telegram_id === WebAppUser().id" :on-switch="onThemeChange" :variants="['day', 'night']" :is-on="curTheme === 'dark'" :is-icons="true"/>
    <UserAvatar size="big" :user="user"/>
    <div class="PageProfile-place" :class="{_gold: place===1, _silver: place===2, _bronze: place===3}" v-if="place">#{{place}}</div>
    <SwitchToggle v-if="user.telegram_id === WebAppUser().id" :on-switch="onLangChange" :variants="['en', 'ru']" :is-on="curLang === 'ru'" :is-icons="false"/>
  </div>
  <div class="PageProfile-name">
    {{ fullName(user) }}
    <span class="iconStar ml4" v-if="user.is_premium"></span>
  </div>
  <div class="PageProfile-receivedCount">{{ lcP('gifts_received_p', user.received_count, true) }}</div>
  <div v-if="user.telegram_id === WebAppUser().id" class="PageProfile-recentActions">
    <span class="mr4 iconTime"></span>
    <router-link :to="{name: 'history'}">{{ lc('Recent Actions') + ' ›' }}</router-link>
  </div>
  <div class="PageProfile-giftsWrap">
    <div v-if="ready && receivedGifts.length" class="PageGifts-gifts">
      <GiftItem @click="bottomSheet.show(gift)" :is-received="true" v-for="gift of receivedGifts" :key="gift._id" :data="gift"/>
    </div>
    <template v-if="ready && !receivedGifts.length">
      <NoGifts animation-path="/animations/emoji-balloons.json" :text="lc('profile_no_gifts')"/>
    </template>
  </div>
</div>
</template>

<style lang="scss">
.PageProfile-place {
  font-size: 14px;
  font-weight: 500;
  color: var(--theme-white);
  line-height: 22px;
  padding: 0 8px;
  border-radius: 20px;
  background-color: var(--theme-label-secondary);
  position: absolute;
  top: 100%;
  transform: translateY(-50%);
  border: 3px solid var(--theme-bg);
  &._gold {background-color: var(--theme-gold)}
  &._silver {background-color: var(--theme-silver)}
  &._bronze {background-color: var(--theme-bronze)}
}
.iconStar {
  background-image: var(--icon_premium);
}
.iconTime {
  background-image: var(--icon_timer);
}
.iconTime, .iconStar {
  background-size: 24px;
  width: 24px;
  height: 24px;
  background-repeat: no-repeat;
}
.PageProfile {
  padding: 8px 16px 16px;
  .PageProfile-avatarWrap {
    position: relative;
    display: flex;
    justify-content: center;
    .Switch {
      position: absolute;
      top: -1px;
      &:first-child {
        left: 0;
      }
      &:last-child {
        right: 0;
      }
    }
  }
  .PageProfile-name {
    font-family: 'SF Pro Text', sans-serif!important;
    padding-top: 20px;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 24px;
    line-height: 32px;
    font-weight: 600;
    display: flex;
    justify-content: center;
  }
  .PageProfile-receivedCount {
    font-size: 17px;
    line-height: 22px;
    color: var(--theme-label-secondary);
    text-align: center;
    padding-top: 4px;
  }
  .PageProfile-recentActions {
    display: flex;
    align-items: center;
    padding-top: 24px;
    font-size: 17px;
    line-height: 22px;
    justify-content: center;
    img {
      width: 24px
    }
  }
  .PageProfile-giftsWrap {
    padding: 24px 0;
  }
}
</style>
