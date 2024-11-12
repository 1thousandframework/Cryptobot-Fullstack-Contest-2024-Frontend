<script setup lang="ts">
import {ref, useTemplateRef} from "vue";
import APIHelper from "@/helpers/APIHelper";
import type {Gift} from "@/types";
import {lc} from "@/locale";
import {storeGifts} from "@/data";
import {useRouter} from "vue-router";
import TheHeader from "@/components/TheHeader.vue";
import StoreGiftItem from "@/components/StoreGiftItem.vue";
const router = useRouter();

const gifts = ref([] as Gift[])

APIHelper.getGifts().then(data => {
  if (data instanceof Error) {

  } else {
    gifts.value.push(...data)
    for (const gift of gifts.value) {
      if (!storeGifts.has(gift._id!)) {
        storeGifts.set(gift._id!, gift)
      }
    }
  }
})

const page = useTemplateRef('page')
const header = useTemplateRef('header')

function scrollHandler(event: Event) {
  const headerEl = header.value!.$el
  headerEl.style.transform = 'scale(' + (1 - (Math.min((event.target as HTMLDivElement).scrollTop, headerEl.offsetHeight) / headerEl.offsetHeight) * 0.25) + ')'
}
</script>

<template>
  <div @scroll="scrollHandler" class="Page PageStore" ref="page">
    <TheHeader class="PageGifts-header" ref="header" :title="lc('store_title')" :subtitle="lc('store_subtitle')" icon="gift_big" />
    <div class="p16 PageStore-gifts" :class="{ _show: gifts.length !== 0 }">
      <StoreGiftItem @click="router.push({ path: '/gift/' + gift._id })" v-for="gift in gifts" :key="gift._id" :data="gift" />
    </div>
  </div>
</template>

<style lang="scss">
.PageStore {
  .PageGifts-header {
    transform-origin: bottom center;
    transform: scale(1);
    transition: 0.1s ease transform;
    will-change: transform;
  }
  .PageStore-gifts {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
    gap: 12px;
  }
}
</style>
