<script setup lang="ts">
import {ref, useTemplateRef, watch} from "vue";
import {curTheme} from "@/helpers/ThemeHelper";

const props = defineProps<{
  variants: [string, string],
  isOn: boolean,
  isIcons: boolean,
  onSwitch?: (isOn: boolean) => void
}>()

const root = useTemplateRef('root')
const isOn = ref(props.isOn)

const status = ref('')
function toggle() {
  isOn.value = !isOn.value
  if (props.onSwitch) {
    props.onSwitch(isOn.value)
  }
  if (isOn.value) {
    status.value = '_enable'
  } else {
    status.value = '_disable'
  }
}

const iconOff = ref('')
const iconOn = ref('')
compute()

watch(curTheme, compute)
function compute() {
  if (curTheme.value === 'dark') {
    iconOff.value = 'var(--iconNight_' + props.variants[0] + ')'
    iconOn.value = 'var(--iconNight_' + props.variants[1] + ')'
  } else {
    iconOff.value = 'var(--icon_' + props.variants[0] + ')'
    iconOn.value = 'var(--icon_' + props.variants[1] + ')'
  }
}

defineExpose({
  switch: toggle,
})
</script>

<template>
  <div class="Switch" @click="toggle" ref="root" :class="[{_on: isOn}, status]">
    <div class="Switch-variant">
      <template v-if="!isIcons">{{variants[0]}}</template>
      <template v-if="isIcons">
        <div class="Switch-variantIcon" :style="{backgroundImage: iconOff}"></div>
      </template>
    </div>
    <div class="Switch-variant">
      <template v-if="!isIcons">{{variants[1]}}</template>
      <template v-if="isIcons">
        <div class="Switch-variantIcon" :style="{backgroundImage: iconOn}"></div>
      </template>
    </div>
    <div class="Switch-controller"></div>
  </div>
</template>

<style lang="scss">
.Switch {
  height: 32px;
  align-items: center;
  position: relative;
  border-radius: 99px;
  cursor: pointer;
  background-color: var(--theme-bg-secondary);
  overflow: hidden;
  display: flex;
  .Switch-variant {
    position: relative;
    z-index: 2;
    padding: 0 10px;
    font-weight: 500;
    font-size: 14px;
    line-height: 22px;
    text-transform: uppercase;
    transition: opacity 0.2s ease;
    .Switch-variantIcon {
      width: 16px;
      height: 16px;
      background-repeat: no-repeat;
      background-size: 16px;
    }
    &:first-child {
      opacity: 1;
    }
    &:first-child+.Switch-variant {
      opacity: 0.5;
    }
  }
  .Switch-controller {
    position: absolute;
    top: 1px;
    bottom: 1px;
    left: 1px;
    z-index: 1;
    width: calc(50% - 1px);
    border: 1px solid rgba(0, 0, 0, 0.04);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12), 0 3px 1px rgba(0, 0, 0, 0.04);
    background-color: var(--theme-bg);
    border-radius: 99px;
  }
  &._on {
    .Switch-controller {
      left: calc(50% - 1px);
      width: calc(50% - 1px);
    }
    .Switch-variant:first-child {
      opacity: 0.5;
    }
    .Switch-variant:first-child+.Switch-variant {
      opacity: 1;
    }
  }
  &._enable {
    .Switch-controller {
      animation-name: AnimSwitchEnable;
      animation-duration: 0.2s;
      animation-timing-function: ease;
      animation-fill-mode: forwards;
    }
  }
  &._disable {
    .Switch-controller {
      animation-name: AnimSwitchDisable;
      animation-duration: 0.2s;
      animation-timing-function: ease;
      animation-fill-mode: forwards;
    }
  }
}
@keyframes AnimSwitchEnable {
  0% {
    left: 1px;
    width: calc(50% - 1px);
  }
  50% {
    left: 1px;
    width: calc(100% - 2px);
  }
  100% {
    left: calc(50% - 1px);
    width: calc(50% - 1px);
  }
}
@keyframes AnimSwitchDisable {
  0% {
    left: calc(50% - 1px);
    width: calc(50% - 1px);
  }
  50% {
    left: 1px;
    width: calc(100% - 2px);
  }
  100% {
    left: 1px;
    width: calc(50% - 1px);
  }
}
</style>
