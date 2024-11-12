<script setup lang="ts">
defineProps<{
  title: string, subtitle: string, icon?: string,
}>()
</script>

<template>
  <div class="Header">
    <div class="Header-icon" v-if="icon"></div>
    <div class="Header-title">{{ title }}</div>
    <div class="Header-subtitle">{{ subtitle }}</div>
  </div>
</template>

<style lang="scss">
.Header {
  font-family: var(--font-sf-pro),sans-serif;
  flex-direction: column;
  padding: 24px 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  .Header-icon {
    background-image: var(--icon_gift);
    background-size: 100%;
    margin-bottom: 16px;
    height: 48px;
    width: 48px;
  }
  .Header-title {
    font-weight: 600;
    font-size: 24px;
    color: var(--theme-text);
    line-height: 32px;
  }
  .Header-subtitle {
    color: var(--theme-label-secondary);
    font-size: 17px;
    line-height: 22px;
    margin-top: 8px;
  }
}
</style>
