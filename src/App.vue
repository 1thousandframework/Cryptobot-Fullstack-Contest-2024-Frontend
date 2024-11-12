<script setup lang="ts">
import {RouterView, useRoute} from 'vue-router'
import NavigationBar from "@/components/NavigationBar.vue";
import {onMounted, provide, ref, useTemplateRef, watch} from "vue";
import type {BottomSheetType, NavigationBarType, TheToastType} from "@/types";
import TheToast from "@/components/TheToast.vue";
import router from "@/router";
import MiniApp, {WebAppUser} from "@/helpers/MiniAppHelper";
import {receiveGiftParam} from "@/utils";
import APIHelper from "@/helpers/APIHelper";
import {receivedActions} from "@/data";
import {lc} from "@/locale";
import BottomSheet from "@/components/BottomSheet.vue";
import {curTheme} from "@/helpers/ThemeHelper";

const route = useRoute()

const navbar = useTemplateRef<NavigationBarType>('navbar')
const bottomSheet = useTemplateRef<BottomSheetType>('bottomSheet')
const toast = useTemplateRef<TheToastType>('toast')


function updateTheme() {
  MiniApp.MainButton.setParams({color: '#007AFF'})
  if (curTheme.value === 'dark') {
    MiniApp.setHeaderColor('#1C1C1E')
    MiniApp.setBackgroundColor('#1c1c1e')
    MiniApp.setBottomBarColor('#1e1e1e')

    document.documentElement.classList.add('dark')
  } else {
    MiniApp.setHeaderColor('#ffffff')
    MiniApp.setBackgroundColor('#ffffff')
    MiniApp.setBottomBarColor('#f1f1f2')

    document.documentElement.classList.remove('dark')
  }
  localStorage.setItem('theme', curTheme.value)
}
watch(curTheme, () => {
  updateTheme()
})
updateTheme()

const curTransition = ref('zoom')
const menuWeights = {
  '/': 1,
  '/gifts': 2,
  '/leaderboard': 3,
  ['/profile/' + WebAppUser().id]: 4
}

function updateNavbar(to: string, from?: string) {
  if (menuWeights[to]) {
    MiniApp.BackButton.hide()
    MiniApp.MainButton.hide()
    navbar.value?.show()
  } else {
    MiniApp.BackButton.show()
    navbar.value?.hide()
  }
  if (to !== '/congrats') {
    MiniApp.SecondaryButton.hide()
  }

  if (from) {
    if (menuWeights[to] && menuWeights[from]) {
      if (menuWeights[to] > menuWeights[from]) {
        curTransition.value = 'slideL'
      } else {
        curTransition.value = 'slideR'
      }
    } else {
      curTransition.value = 'zoom'
    }
  }
}

// provide('navbar', navbar)
provide('toast', toast)
provide('bottomSheet', bottomSheet)

router.beforeEach((to, from) => {
  updateNavbar(to.path, from.path)
})

onMounted(() => {
  const startParam = MiniApp.initDataUnsafe.start_param
  if (startParam) {
    const match = startParam.match(receiveGiftParam)
    if (match !== null) {
      APIHelper.receiveGift(match[1] as string).then(action => {
        if (action instanceof Error) {
          if (action.message === 'already_activated') {
            toast.value!.show(
              'already-activated', 'play',
              lc('toast_already_received_title'), lc('toast_already_received_subtitle'),
              lc('Close'), () => {}
            )
          }
        } else {
          receivedActions.set(match[1], action)
          router.push({
            name: 'congrats',
            state: {
              type: 'receive',
              actionId: match[1]
            }
          })
        }
      })
    }
  }

  updateNavbar(route.path)
})
</script>

<template>
  <div class="Pages">
    <RouterView v-slot="{ Component }">
      <transition :name="curTransition">
        <component :is="Component"></component>
      </transition>
    </RouterView>
  </div>
  <NavigationBar ref="navbar" />
  <TheToast ref="toast" />
  <BottomSheet ref="bottomSheet" />
</template>

<style>
.zoom-enter-active, .zoom-leave-active {
  transition: opacity 0.25s, transform 0.25s;
}
.zoom-enter-from {
  transform: scale(0.8);
  opacity: 0;
}
.zoom-leave-to {
  transform: scale(0.8);
  opacity: 0;
}

.slideL-enter-active, .slideL-leave-active {
  transition: transform 0.25s;
}
.slideL-enter-from {
  transform: translateX(100%);
}
.slideL-leave-to {
  transform: translateX(-100%);
}

.slideR-enter-active, .slideR-leave-active {
  transition: transform 0.25s;
}
.slideR-enter-from {
  transform: translateX(-100%);
}
.slideR-leave-to {
  transform: translateX(100%);
}

.Pages {
  flex: 1;
  position: relative;
}
</style>
