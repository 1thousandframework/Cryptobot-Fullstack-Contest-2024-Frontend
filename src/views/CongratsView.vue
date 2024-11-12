<script setup lang="ts">
import {inject, onMounted, onUnmounted, type Ref, ref} from "vue";
import {lc} from "@/locale";
import {f, fullName} from "@/utils";
import LottiePlayer from "@/components/LottiePlayer.vue";
import {price, type TheToastType} from "@/types";
import MiniApp, {WebAppUser} from "@/helpers/MiniAppHelper";
import {receivedActions} from "@/data";
import router from "@/router";

const actionId = history.state.actionId
const action = receivedActions.get(actionId!)!
const type = ref(history.state.type)

const title = ref('')
const subtitle = ref('')

if (!action) {
  router.back()
} else {
  if (type.value === 'receive') {
    title.value = lc('Gift Received')
    subtitle.value = f(lc('gift_received_desc'), action.gift!.name)

    const toast = inject('toast') as Ref<TheToastType>
    toast.value!.show(
      'gift-' + action.gift!.animation,
      action.gift!.play_algo,
      lc('Gift Received'),
      f(lc('gift_toast_received'), action.gift!.name, fullName(action.user!)),
      lc('View'),
      () => {
        router.replace('/profile/' + WebAppUser().id)
      }
    )
  } else if (type.value === 'purchase') {
    title.value = lc('gift_purchased_title')
    subtitle.value = f(lc('gift_purchased_info'), action.gift!.name, price(action.gift!))

    const toast = inject('toast') as Ref<TheToastType>
    toast.value!.show(
      'gift-' + action.gift!.animation,
      action.gift!.play_algo,
      lc('purchased_toast_title'),
      lc('purchased_toast_subtitle'),
      lc('Send'),
      () => {
        MiniApp.switchInlineQuery(action._id, ['users'])
      },
    )
  }
}

function onMainButtonClick() {
  if (type.value === 'receive') {
    router.replace({
      path: '/profile/' + WebAppUser().id
    })
  } else if (type.value === 'purchase') {
    MiniApp.switchInlineQuery(action._id, ['users'])
  }
}

function onSecondaryButtonClick() {
  router.replace({
    path: '/'
  })
}

onMounted(() => {
  let mainBtnText = ''
  if (type.value === 'receive') {
    mainBtnText = lc('Open Profile')
  } else if (type.value === 'purchase') {
    mainBtnText = lc('Send Gift')
  }

  MiniApp.MainButton.onClick(onMainButtonClick)
  MiniApp.MainButton.setParams({
    is_active: true,
    is_visible: true,
    text: mainBtnText
  })
  if (type.value === 'purchase') {
    MiniApp.SecondaryButton.onClick(onSecondaryButtonClick)
    MiniApp.SecondaryButton.setParams({
      is_active: true,
      is_visible: true,
      text: lc('Open Store')
    })
  }
})

onUnmounted(() => {
  MiniApp.MainButton.offClick(onMainButtonClick)
  MiniApp.SecondaryButton.offClick(onSecondaryButtonClick)
})
</script>

<template>
  <div v-if="type && action" class="Page PageCongrats">
    <div class="PageCongrats-content">
      <div class="PageCongrats-congratsWrap">
        <div class="PageCongrats-congrats">
          <LottiePlayer :path="`/animations/effect-gift-purchased.json`" />
        </div>
      </div>
      <div class="PageCongrats-animationWrap">
        <div class="PageCongrats-animation">
          <LottiePlayer :path="`/animations/gift-${action.gift!.animation}.json`" :play-algo="action.gift!.play_algo" />
        </div>
      </div>
      <div class="PageCongrats-title">{{title}}</div>
      <div class="PageCongrats-subtitle">{{subtitle}}</div>
    </div>
  </div>
</template>

<style lang="scss">
.PageCongrats {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  .PageCongrats-content {
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    position: relative;
    padding: 16px;
    .PageCongrats-congratsWrap {
      position: absolute;
      width: 80%;
      height: 0;
      padding-bottom: 80%;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 5;
      .PageCongrats-congrats {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
    .PageCongrats-animationWrap {
      width: 100px;
      height: 100px;
      margin-bottom: 16px;
      position: relative;
      .PageCongrats-animation {
        position: absolute;
        width: 100%;
        height: 100%;
      }
    }
    .PageCongrats-title {
      font-size: 24px;
      line-height: 30px;
      font-weight: 500;
      margin-bottom: 8px;
    }
    .PageCongrats-subtitle {
      font-size: 17px;
      line-height: 22px;
    }
  }
}
</style>
