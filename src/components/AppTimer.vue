<script setup lang="ts">
import { ref, watch } from 'vue'
import { useTime } from '@/composables/time'
import { useDing } from '@/composables/ding'

const props = defineProps<{ title: string; duration: number }>()
const ding = useDing()
const seconds = ref<number>(props.duration)
const { minute1, minute0, second1, second0 } = useTime(seconds)
const enabled = ref<boolean>(true)

let interval: number | null = null

function start() {
  if (interval) return
  if (!seconds.value) seconds.value = props.duration
  interval = setInterval(() => seconds.value--, 1000)
  enabled.value = false
}

function stop() {
  if (interval) clearInterval(interval)
  enabled.value = true
  interval = null
}

watch(seconds, () => {
  if (seconds.value <= 0) {
    stop()
    seconds.value = 0
    ding.play()
  }
})
</script>

<template>
  <h3 :class="{ 'visually-hidden': !title }">{{ title ?? 'untitled timer' }}</h3>
  <div class="timer box" :class="{ done: !seconds }">
    <div class="time">
      <div>
        <span>{{ minute1 }}</span
        ><span>{{ minute0 }}</span>
      </div>
      :
      <div>
        <span>{{ second1 }}</span
        ><span>{{ second0 }}</span>
      </div>
    </div>
    <div class="controls">
      <button :disabled="!enabled" @click="start">start</button>
      <button :disabled="enabled" @click="stop">stop</button>
    </div>
  </div>
</template>

<style scoped>
.timer {
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
  justify-content: space-between;
  margin-block-end: 1em;
}

.timer.done {
  background-color: #990000;
}

h3 {
  margin-block-end: -1em;
  font-size: 2em;
}

.time {
  display: flex;
  font-size: 4em;
  font-weight: bold;
  line-height: 1;
}

.controls {
  display: flex;
  flex-wrap: wrap;
  gap: 1em;
  align-self: center;
}
</style>
