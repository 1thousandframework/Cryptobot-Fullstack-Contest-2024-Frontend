<script setup lang="ts">
import type {Action} from "@/types";
import {computed, ref, useTemplateRef} from "vue";
import MiniApp, {setBackBtnHandler, setBackButtonDefaultHandler} from "@/helpers/MiniAppHelper";
import {curLang, lc} from "@/locale";
import LottiePlayer from "@/components/LottiePlayer.vue";
import {f, fullName} from "../utils";
import AssetIcon from "@/components/AssetIcon.vue";
import UserAvatar from "@/components/UserAvatar.vue";

const action = ref<Action | null>(null)
const bg = useTemplateRef('bg')
const content = useTemplateRef('content')

function onMainButtonClick() {
  if (action.value?.target_action) {
    hide()
  } else {
    MiniApp.switchInlineQuery(action.value!._id!, ['users'])
    hide()
  }
}

function hide() {
  setBackButtonDefaultHandler()
  MiniApp.BackButton.hide()
  MiniApp.MainButton.hide()
  MiniApp.MainButton.offClick(onMainButtonClick)
  bg.value!.classList.add('_bottomSheetFadeOut')
  content.value!.classList.add('BottomSheet-animHide')
}

function show() {
  MiniApp.BackButton.show()
  setBackBtnHandler(() => {
    hide()
  })
  MiniApp.MainButton.onClick(onMainButtonClick)
  if (action.value?.target_action) {
    MiniApp.MainButton.setText(lc('Close'))
  } else {
    MiniApp.MainButton.setText(lc('Send Gift to Contact'))
  }
  MiniApp.MainButton.show()

  bg.value!.classList.remove('_none')
  bg.value!.classList.add('_bottomSheetFadeIn')

  content.value!.classList.remove('_none')
  content.value!.classList.add('BottomSheet-animShow')
}

defineExpose({
  show: (newAction: Action) => {
    action.value = newAction
    show()
  },
  hide: () => {
    hide()
  }
})

function animationEnd(event: AnimationEvent) {
  if (event.animationName === 'animBottomSheetHide') {
    content.value!.classList.add('_none')
    bg.value!.classList.add('_none')

    content.value!.classList.remove('BottomSheet-animShow', 'BottomSheet-animHide')
    bg.value!.classList.remove('_bottomSheetFadeIn', '_bottomSheetFadeOut')
  }
}

const computedValue = computed(() => {
  if (action.value !== null) {
    const createdAt = action.value!.target_action ? action.value!.target_action.created_at : action.value!.created_at
    const date = new Date(createdAt! * 1000);
    return date.toLocaleDateString(curLang.value, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    }) + ' ' + date.toLocaleTimeString(curLang.value)
  } else {
    return ''
  }
});

</script>

<template>
  <div ref="bg" @click="hide" class="BottomSheet-bg _none"></div>
  <div ref="content" @animationend="animationEnd" class="BottomSheet _none">
    <button class="BottomSheet-close" @click="hide"></button>
    <template v-if="action">
      <div class="BottomSheet-animation">
        <LottiePlayer :loop="true" :path="`/animations/gift-${action.gift!.animation}.json`" :play-algo="action.gift!.play_algo"/>
      </div>

      <div v-if="action.target_action" class="BottomSheet-title">{{action.gift!.name}}</div>
      <div v-else class="BottomSheet-title">{{ lc('Send Gift') }}</div>

      <div class="BottomSheet-table">
        <div class="BottomSheet-row">
          <template v-if="action.target_action">
            <div class="BottomSheet-cell">{{lc('From')}}</div>
            <div class="BottomSheet-cell">
              <UserAvatar :user="action.target_user!" size="small" class="mr8"/>
              <router-link :to="'/profile/' + action.target_user!.telegram_id">{{ fullName(action.target_user!) }}</router-link>
            </div>
          </template>
          <template v-else>
            <div class="BottomSheet-cell">{{lc('Gift')}}</div>
            <div class="BottomSheet-cell">{{ action.gift!.name }}</div>
          </template>
        </div>
        <div class="BottomSheet-row">
          <div class="BottomSheet-cell">{{lc('Date')}}</div>
          <div class="BottomSheet-cell">{{ computedValue }}</div>
        </div>
        <div class="BottomSheet-row">
          <div class="BottomSheet-cell">{{lc('Price')}}</div>
          <div class="BottomSheet-cell">
            <AssetIcon class="mr8" :asset="action.gift!.asset.toLowerCase()" />
            {{ action.gift!.price + ' ' + action.gift!.asset }}
          </div>
        </div>
        <div class="BottomSheet-row">
          <div class="BottomSheet-cell">{{lc('Availability')}}</div>
          <div class="BottomSheet-cell">{{ f(lc('pagination'), action.gift!.availability!, action.gift!.supply) }}</div>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss">
.BottomSheet-close {
  border-radius: 50%;
  width: 30px;
  height: 30px;
  background-color: var(--theme-close-bg);
  background-image: var(--icon_cross);
  background-repeat: no-repeat;
  background-size: 12px;
  position: absolute;
  top: 12px;
  right: 16px;
  background-position: center;
}
.BottomSheet-bg {
  position: fixed;
  width: 100%;
  opacity: 0.5;
  background-color: #000000;
  height: 100%;
  z-index: 101;
  display: none;
}
.BottomSheet {
  display: flex;
  align-items: center;
  flex-direction: column;
  justify-content: center;
  position: absolute;
  bottom: 0;
  width: 100%;
  z-index: 102;
  box-sizing: border-box;
  border-radius: 10px 10px 0 0;
  background-color: var(--theme-bottom-sheet-bg);
  padding: 16px;
  .BottomSheet-animation {
    width: 120px;
    height: 120px;
  }
  .BottomSheet-title {
    font-size: 24px;
    font-weight: 600;
    line-height: 32px;
    padding-top: 16px;
    padding-bottom: 24px;
  }
  .BottomSheet-table {
    width: 100%;
    background-color: var(--theme-bottom-sheet-table);
    border-radius: 12px;
    .BottomSheet-row {
      display: flex;
      position: relative;
      &::before {
        left: 0;
        content: '';
        position: absolute;
        height: 1px;
        width: 100%;
        bottom: 0;
        background-color: var(--theme-separator);
        transform: scaleY(var(--separator-scale));
        transform-origin: bottom center;
      }
      &:last-child::before {
        display: none;
      }
      .BottomSheet-cell {
        padding: 10px 16px;
        position: relative;
        font-size: 17px;
        line-height: 22px;
        display: flex;
        justify-content: left;
        align-items: center;
        &:first-child {
          color: var(--theme-label-secondary);
          width: 33%;
        }
        &::before {
          content: '';
          position: absolute;
          width: 1px;
          height: 100%;
          top: 0;
          right: 0;
          background-color: var(--theme-separator);
          transform: scaleX(var(--separator-scale));
          transform-origin: center right;;
        }
        &:last-child::before {
          display: none;
        }
      }
    }
  }
}
.BottomSheet-animShow {
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
  animation-name: animBottomSheetShow;
}
.BottomSheet-animHide {
  animation-timing-function: ease-out;
  animation-name: animBottomSheetHide;
}
@keyframes animBottomSheetHide {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}
@keyframes animBottomSheetShow {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}


._bottomSheetFadeIn {
  animation-duration: 0.2s;
  animation-fill-mode: forwards;
  animation-timing-function: ease-in;
  animation-name: bottomSheetFadeIn;
  display: block;
}
._bottomSheetFadeOut {
  animation-timing-function: ease-out;
  animation-name: bottomSheetFadeOut;
  display: block;
}
@keyframes bottomSheetFadeIn {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 0.5;
  }
}
@keyframes bottomSheetFadeOut {
  0% {
    opacity: 0.5;
  }
  100% {
    opacity: 0;
  }
}
</style>
