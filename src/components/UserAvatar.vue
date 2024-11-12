<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {getCSSClassByTelegramId} from "@/utils";
import type {Size, User} from "@/types";
import {ACTION_TYPE_PURCHASE, ACTION_TYPE_RECEIVE, ACTION_TYPE_SEND} from "@/data";
import AvatarStatus from "@/components/AvatarStatus.vue";

const props = defineProps<{
  user: User
  size?: Size
  actionType?: number,
}>()

const color = ref('')

watch(() => props.user, () => {
  reflowAvatarColor()
})

const classObject = computed(() => ({
  _text: !(props.user?.avatar_url),
  _tiny: props.size === 'tiny',
  _small: props.size === 'small',
  _medium: props.size === 'medium',
  _big: props.size === 'big',
  _received: props.actionType === ACTION_TYPE_RECEIVE,
  _sent: props.actionType === ACTION_TYPE_SEND,
  _purchased: props.actionType === ACTION_TYPE_PURCHASE,
}))

function reflowAvatarColor() {
  color.value = getCSSClassByTelegramId(props.user.telegram_id)
}

// @ts-expect-error
// no intl support
const segmenter = new Intl.Segmenter()
// @ts-expect-error
// no intl support
let avatarLetters = Array.from(segmenter.segment(props.user.first_name))[0].segment
if (typeof props.user.last_name === 'string' && props.user.last_name.length > 0) {
  // @ts-expect-error
  // no intl support
  avatarLetters += Array.from(segmenter.segment(props.user.last_name))[0].segment
}
const avatarEl = ref<HTMLDivElement | null>(null)
onMounted(() => {
  reflowAvatarColor()
})
</script>

<template>
  <div ref="avatarEl" class="Avatar" :class="[classObject, color]" :data-text="avatarLetters">
    <img v-if="user.avatar_url" :src="user.avatar_url">
    <AvatarStatus v-if="actionType" />
  </div>
</template>

<style lang="scss">
._red::before {
  background: linear-gradient(#FF845E, #D45246);
}
._orange::before {
  background: linear-gradient(#FEBB5B, #F68136);
}
._violet::before {
  background: linear-gradient(#B694F9, #6C61DF);
}
._green::before {
  background: linear-gradient(#9AD164, #46BA43);
}
._cyan::before {
  background: linear-gradient(#53EDD6, #28C9B7);
}
._pink::before {
  background: linear-gradient(#FF8AAC, #D95574);
}
._blue::before {
  background: linear-gradient(#5CAFFA, #408ACF);
}

.Avatar {
  border-radius: 50%;
  position: relative;
  background-size: 100%;
  background-repeat: no-repeat;
  img {
    position: absolute;
    width: 100%;
    height: 100%;
    border-radius: 50%;
  }
  &._big {
    width: 100px;
    font-size: 32px;
    height: 100px;
  }
  &._medium {
    width: 40px;
    font-size: 15px;
    height: 40px;
  }
  &._small {
    width: 20px;
    font-size: 8px;
    height: 20px;
  }
  &._tiny {
    width: 16px;
    font-size: 6px;
    height: 16px;
  }
}
.Avatar._text::before {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  border-radius: 50%;
  width: 100%;
  height: 100%;
  font-weight: 500;
  color: #ffffff;
  content: attr(data-text)
}
</style>
