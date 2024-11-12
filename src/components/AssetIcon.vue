<script setup lang="ts">
const props = defineProps<{
  asset: string,
}>()
</script>

<template>
  <div :style="{backgroundImage: 'var(' + 'icon_' + asset + ')'}" :class="{ ['_' + props.asset]: true }" class="AssetIcon"></div>
</template>

<style lang="scss">
.AssetIcon {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-size: 100%;
  background-repeat: no-repeat;
  &._usdt {
    background-color: #009393;
    background-image: var(--icon_usdt);
  }
  &._ton {
    background-color: #35AFF1;
    background-image: var(--icon_ton);
  }
  &._eth {
    background-color: #627EEA;
    background-image: var(--icon_eth);
  }
}
</style>
