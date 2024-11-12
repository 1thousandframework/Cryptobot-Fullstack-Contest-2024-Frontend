<script setup lang="ts">
import NoGifts from "@/components/NoGifts.vue";
import {lc} from "@/locale";
import TheHeader from "@/components/TheHeader.vue";
import APIHelper from "@/helpers/APIHelper";
import {inject, type Ref, ref, useTemplateRef} from "vue";
import type {Action, BottomSheetType} from "@/types";
import GiftItem from "@/components/GiftItem.vue";
import {ACTIONS_PER_RESULT} from "@/config";
const bottomSheet = inject('bottomSheet') as Ref<BottomSheetType>

let canLoadMore = true
let loading = false
const ready = ref(false)
const gifts = ref<Action[]>([])
let offset = 0
function loadData() {
  if (loading) return
  loading = true
  APIHelper.getUnsentGifts(offset).then(result => {
    if (result instanceof Error) {

    } else {
      if (result.length < ACTIONS_PER_RESULT) {
        canLoadMore = false
      }
      gifts.value.push(...result)
    }
    offset += ACTIONS_PER_RESULT
  }).finally(() => {
    ready.value = true
    loading = false
  })
}
loadData()

const header = useTemplateRef('header')
function scrollHandler(event: Event) {
  const target = event.target as HTMLDivElement

  const headerEl = header.value!.$el
  headerEl.style.transform = 'scale(' + (1 - (Math.min(target.scrollTop, headerEl.offsetHeight) / headerEl.offsetHeight) * 0.25) + ')'

  if ((target.scrollTop + target.offsetHeight > target.scrollHeight - 100) && canLoadMore) {
    loadData()
  }
}


</script>

<template>
  <div @scroll="scrollHandler" class="Page PageGifts" ref="page">
    <TheHeader ref="header" :title="lc('gifts_title')" :subtitle="lc('gifts_subtitle')" />
    <div class="ph16 pv8">
      <NoGifts v-if="ready && !gifts.length" animation-path="/animations/emoji-balloons.json" :text="lc('no_gifts_title')"/>
      <div class="PageGifts-gifts" v-if="ready && gifts.length">
        <GiftItem @click="bottomSheet.show(gift)" :is-received="false" v-for="gift of gifts" :key="gift._id" :data="gift"/>
      </div>
    </div>
  </div>
</template>

<style>
.PageGifts-gifts {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 8px;
}
</style>
