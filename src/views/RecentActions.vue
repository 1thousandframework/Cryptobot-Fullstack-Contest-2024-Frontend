<script setup lang="ts">
import TheHeader from "@/components/TheHeader.vue";
import {curLang, lc} from "@/locale";
import LottiePlayer from "@/components/LottiePlayer.vue";
import {onMounted, onUnmounted, ref, useTemplateRef} from "vue";
import type {Action} from "@/types";
import MiniApp from "@/helpers/MiniAppHelper";
import router from "@/router";
import APIHelper from "@/helpers/APIHelper";
import {ACTIONS_PER_RESULT} from "@/config";
import ActionItem from "@/components/ActionItem.vue";
import {isSameDate} from "@/utils";

const header = useTemplateRef('header')
let canLoadMore = true
let loading = false
const ready = ref(false)
const historyItems = ref<Action[]>([])

let offset = 0
function loadData() {
  if (loading) return
  loading = true
  APIHelper.getHistory(offset).then(actions => {
    if (actions instanceof Error) {

    } else {
      if (actions.length < ACTIONS_PER_RESULT) {
        canLoadMore = false
      }
      historyItems.value.push(...actions)
    }
    offset += ACTIONS_PER_RESULT
  }).finally(() => {
    ready.value = true
    loading = false
  })
}
loadData()

function onMainButtonClick() {
  router.replace({name: 'store'})
}
onMounted(() => {
  MiniApp.MainButton.onClick(onMainButtonClick)
  MiniApp.MainButton.setParams({
    is_active: true,
    is_visible: true,
    text: lc('Open Store')
  })
})
onUnmounted(() => {
  MiniApp.MainButton.offClick(onMainButtonClick)
})

function onScroll(event: Event) {
  const target = event.target as HTMLDivElement
  const headerEl = header.value!.$el
  headerEl.style.transform = 'scale(' + (1 - (Math.min(target.scrollTop, headerEl.offsetHeight) / headerEl.offsetHeight) * 0.25) + ')'

  if ((target.scrollTop + target.offsetHeight > target.scrollHeight - 100) && canLoadMore) {
    loadData()
  }
}
</script>

<template>
  <div @scroll="onScroll" class="Page" v-if="ready">
    <div v-if="historyItems.length">
      <TheHeader ref="header" :title="lc('Recent Actions')" :subtitle="lc('recent_actions_subtitle')"/>
      <div>
        <template v-for="(action, idx) in historyItems" :key="action._id!">
          <div class="PageHistory-dateHeader" v-if="idx === 0 || (idx > 0 && !isSameDate(historyItems[idx-1].created_at!, action.created_at!))">
            {{ new Date(action.created_at! * 1000).toLocaleDateString(curLang, {month: 'long', day: 'numeric'}) }}
          </div>
          <ActionItem :class="{_noSeparator: idx === 0 || (idx > 0 && !isSameDate(historyItems[idx-1].created_at!, action.created_at!)) }" type="gift" :action="action" />
        </template>
      </div>
    </div>
    <div v-if="!historyItems.length" class="PageHistory-content">
      <div class="PageHistory-animationWrap">
        <div class="PageHistory-animation">
          <LottiePlayer :path="`/animations/emoji-balloons.json`" />
        </div>
      </div>
      <div class="PageHistory-title">{{ lc('history_empty') }}</div>
      <div class="PageHistory-subtitle">{{ lc('history_desc') }}</div>
    </div>
  </div>
</template>

<style lang="scss">
.PageHistory-dateHeader {
  font-size: 13px;
  line-height: 18px;
  text-transform: uppercase;
  color: var(--theme-label-date);
  padding: 24px 16px 12px;
}
.PageHistory-content {
  height: 100%;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  padding: 16px;
  .PageHistory-congratsWrap {
    position: absolute;
    width: 80%;
    height: 0;
    padding-bottom: 80%;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    pointer-events: none;
    z-index: 5;
    .PageHistory-congrats {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .PageHistory-animationWrap {
    width: 100px;
    height: 100px;
    margin-bottom: 16px;
    position: relative;
    .PageHistory-animation {
      position: absolute;
      width: 100%;
      height: 100%;
    }
  }
  .PageHistory-title {
    font-size: 24px;
    line-height: 30px;
    font-weight: 600;
    margin-bottom: 8px;
  }
  .PageHistory-subtitle {
    font-size: 17px;
    line-height: 22px;
  }
}
</style>
