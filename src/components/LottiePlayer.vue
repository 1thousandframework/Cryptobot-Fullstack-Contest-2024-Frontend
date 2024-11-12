<script setup lang="ts">
import {onMounted, onUnmounted, ref, watch} from "vue";
const props = withDefaults(defineProps<{
  playAlgo?: string
  // @ts-expect-error because I don't know how to set up global var lottie.
  renderer?: RendererType
  loop?: boolean
  autoplay?: boolean
  path: string
  ready?: () => void
}>(), {
  playAlgo: 'play',
  loop: false,
  renderer: 'canvas',
  autoplay: true
})

const container = ref(null)

// @ts-expect-error because I don't know how to set up global var lottie.
let animation: AnimationItem
let stagePtr = 0
let isPlaying = false
let stages = props.playAlgo.split(' ')

watch(() => props.path, () => {
  animation.destroy()
  loadAnimation(props.path)
});

function play(systemCall?: boolean) {
  if (isPlaying && !systemCall) return
  if (!isPlaying) isPlaying = true
  const action = stages[stagePtr]
  if (action === 'play') {
    animation.setDirection(1)
    animation.goToAndPlay(0, true)
  } else if (action == 'reverseplay') {
    animation.setDirection(-1)
    animation.goToAndPlay(animation.getDuration(true) - 1, true)
  }
  stagePtr++
}

function loadAnimation(path: string) {
  stagePtr = 0
  isPlaying = false
  stages = props.playAlgo.split(' ')
  // @ts-expect-error because I don't know how to set up global var lottie.
  animation = window.lottie.loadAnimation({
    container: container.value!,
    renderer: props.renderer,
    loop: false,
    autoplay: false,
    path: path,
  });
  animation.addEventListener('complete', () => {
    if (stagePtr === stages.length) {
      stagePtr = 0
      isPlaying = false
      if (props.loop) {
        play()
      }
    } else {
      play(true)
    }
  })
  animation.addEventListener('data_ready', () => {
    if (stages[0] === 'reverseplay') {
      animation.goToAndStop(animation.getDuration(true) - 1, true)
    }
    if (props.ready) {
      props.ready()
    }
    if (props.autoplay) {
      play()
    }
  })
}

onMounted(async () => {
  loadAnimation(props.path)
})

onUnmounted(() => {
  animation.destroy()
})

defineExpose({
  play: play,
})

</script>

<template>
  <div class="LottiePlayer" ref="container"></div>
</template>

<style>
.LottiePlayer {
  width: 100%;
  height: 100%;
}
</style>
