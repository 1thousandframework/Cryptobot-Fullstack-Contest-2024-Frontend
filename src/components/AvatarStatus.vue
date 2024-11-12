<script setup lang="ts"></script>

<template>
  <div class="Avatar-statusStroke"></div>
  <div class="Avatar-status"></div>
</template>

<style lang="scss">
.Avatar-status, .Avatar-statusStroke {
  display: none;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  position: absolute;
  right: -2px;
  bottom: 1px;
  background-size: 16px;
}
.Avatar-statusStroke {
  transform: scale(1.0625);
  background-color: var(--theme-bg);
}
._received, ._sent, ._purchased {
  .Avatar-status, .Avatar-statusStroke {
    display: block;
  }
}
._received {
  .Avatar-status {
    background-image: var(--icon_status_received);
    background-color: var(--theme-green);
  }
}
._sent {
  .Avatar-status {
    background-image: var(--icon_status_sent);
    background-color: var(--theme-purple);
  }
}
._purchased {
  .Avatar-status {
    background-image: var(--icon_status_purchased);
    background-color: var(--theme-blue);
  }
}
</style>
