<script setup lang="ts">
import {computed, ref} from "vue";
import type {User} from "@/types";
import APIHelper from "@/helpers/APIHelper";
import {ACTIONS_PER_RESULT} from "@/config";
import ActionItem from "@/components/ActionItem.vue";
import router from "@/router";

let canLoadMore = true
let loading = false
const ready = ref(false)
const leaders = ref<User[]>([])

let offset = 0
function loadData() {
  if (loading) return
  loading = true
  APIHelper.getLeaders(offset).then(users => {
    if (users instanceof Error) {

    } else {
      if (users.length < ACTIONS_PER_RESULT) {
        canLoadMore = false
      }
      leaders.value.push(...users)
    }
    offset += ACTIONS_PER_RESULT
  }).finally(() => {
    ready.value = true
    loading = false
  })
}
loadData()

function onScroll(event: Event) {
  const target = event.target as HTMLDivElement
  if ((target.scrollTop + target.offsetHeight > target.scrollHeight - 100) && canLoadMore) {
    loadData()
  }
}
</script>

<template>
<div class="Page" @scroll="onScroll">
  <ActionItem @click="router.push({path: '/profile/' + user.telegram_id})" :place="(idx + 1)" :key="user.telegram_id" type="position" :action="{user: user, _id: '', actor_telegram_id: 0, gift_id: '', action_type: 0}" v-for="(user, idx) of leaders" />
</div>
</template>

<style scoped lang="scss">

</style>
