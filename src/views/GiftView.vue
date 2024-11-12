<script setup lang="ts">
import {getGift} from "@/data";
import {useRoute} from "vue-router";
import type {Action, Gift} from "@/types";
import {lc} from "@/locale";
import {f, formatQuantity} from "@/utils";
import {onBeforeUnmount, onMounted, ref} from "vue";
import {hex2rgb, rgb2rgbaString} from "@/utils/color";
import MiniApp from "@/helpers/MiniAppHelper";
import APIHelper from "@/helpers/APIHelper";
import AssetIcon from "@/components/AssetIcon.vue";
import LottiePlayer from "@/components/LottiePlayer.vue";
import {ACTIONS_PER_RESULT} from "@/config";
import ActionItem from "@/components/ActionItem.vue";
import NoGifts from "@/components/NoGifts.vue";
const route = useRoute()

let canLoadMore = true
let loading = false
const ready = ref(false)
const recentActions = ref<Action[]>([])

let offset = 0
function loadData() {
  if (loading) return
  loading = true
  APIHelper.getGiftRecentActions(route.params.id as string, 0).then(result => {
    if (result instanceof Error) {

    } else {
      if (result.length < ACTIONS_PER_RESULT) {
        canLoadMore = false
      }
      recentActions.value.push(...result)
    }
    offset += ACTIONS_PER_RESULT
  }).finally(() => {
    ready.value = true
    loading = false
  })
}
loadData()

const gift = ref<Gift | null>(null)
const giftWrapper = ref<HTMLDivElement | null>(null)

const giftLoading = getGift(route.params.id as string).then(maybeGift => {
  if (maybeGift !== null && !(maybeGift instanceof Error)) {
    gift.value = maybeGift
  }
})

function onMainButtonClick() {
  MiniApp.MainButton.showProgress()
  APIHelper.createInvoice(gift.value!._id!).then((result) => {
    if (result instanceof Error) {

    } else {
      MiniApp.openTelegramLink(result.mini_app_url)
    }
  }).finally(() => {
    MiniApp.MainButton.hideProgress()
  })
}

onMounted(() => {
  MiniApp.MainButton.onClick(onMainButtonClick)
  MiniApp.MainButton.setParams({
    is_active: true,
    is_visible: true,
    text: lc('buy_gift')
  })

  giftLoading.then(() => {
    if (giftWrapper.value) {
      const rgbColor = hex2rgb(gift.value!.color)
      giftWrapper.value!.style.backgroundImage = 'var(--pattern-url), linear-gradient(' + [rgb2rgbaString(rgbColor, 0.2), rgb2rgbaString(rgbColor, 0.1)].join(',') + ')';
    }
  })
})

onBeforeUnmount(() => {
  MiniApp.MainButton.offClick(onMainButtonClick)
})

function onScroll(event: Event) {
  const target = event.target as HTMLDivElement
  if ((target.scrollTop + target.offsetHeight > target.scrollHeight - 100) && canLoadMore) {
    loadData()
  }
}
</script>

<template>
  <div @scroll="onScroll" v-if="gift" class="Page PageGift bgSecondary">
    <div class="p16 Section">
      <div class="PageGift-giftWrap" ref="giftWrapper">
        <div class="PageGift-gift">
          <LottiePlayer :play-algo="gift.play_algo" :path="`/animations/gift-${gift!.animation}.json`" :loop="true" />
        </div>
      </div>
      <div class="PageGift-title">
        <div class="PageGift-titleText"> {{ gift?.name }}</div>
        <div class="PageGift-count">{{ f(lc('pagination'), gift!.purchased_count!, formatQuantity(gift!.supply!)) }}</div>
      </div>
      <div class="PageGift-desc">{{ lc('gift_desc') }}</div>
      <div class="PageGift-priceWrap">
        <AssetIcon :asset="gift.asset.toLowerCase()" />
        <div class="ml8">{{ gift.price + ' ' + gift.asset }}</div>
      </div>
    </div>
    <div class="Section mt16" v-if="ready">
      <div class="Section-title">{{ lc('Recent actions') }}</div>
      <div v-if="recentActions.length">
        <ActionItem v-for="action in recentActions" :key="action._id" :action="action" type="user" />
      </div>
      <div class="pb16 ph16" v-if="!recentActions.length">
        <NoGifts :text="lc('gift_history_empty_msg')" animation-path="/animations/history-empty.json" />
        <ActionItem v-for="action in recentActions" :key="action._id" :action="action" type="user" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.PageGift {
  background-color: var(--theme-bg-secondary)!important;
}
.PageGift-giftWrap {
  background-size: cover;
  border-radius: 16px;
  width: 100%;
  height: 0;
  padding-bottom: 100%;
  position: relative;
  .PageGift-gift {
    position: absolute;
    width: 100%;
    height: 100%;
  }
}
.PageGift-title {
  display: flex;
  align-items: center;
  padding-top: 12px;
}
.PageGift-titleText {
  font-size: 24px;
  font-weight: 600;
  line-height: 32px;
}
.PageGift-count {
  flex-shrink: 0;
  margin-left: 12px;
  font-size: 14px;
  line-height: 22px;
  background-color: var(--theme-primary-bg);
  padding-left: 8px;
  padding-right: 8px;
  color: var(--theme-primary);
  border-radius: 30px;
}
.PageGift-desc {
  padding-top: 8px;
  font-size: 17px;
  line-height: 22px;
  color: var(--theme-label-secondary);
}
.PageGift-priceWrap {
  display: flex;
  font-size: 17px;
  line-height: 22px;
  align-items: center;
  padding-top: 12px;
}
</style>
