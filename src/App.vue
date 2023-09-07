<script setup lang="ts">
import AppTimer from '@/components/AppTimer.vue'
import {computed, onBeforeMount, ref, watch} from 'vue'
import {useTime} from '@/composables/time'

const timers = ref<{ id: number; duration: number; title: string }[]>([])
const durInput = ref()

const title = ref<string>('')
const duration = ref<number>(0)
const {minute1, minute0, second1, second0, toNumber} = useTime(duration)
let autoIncrementId = 0

function addTimer() {
  if (!duration.value) {
    durInput.value.focus()
    return
  }
  timers.value.push({id: autoIncrementId++, duration: duration.value, title: title.value})
  duration.value = 0
  title.value = ''
}

onBeforeMount(() => {
  const url = new URL(location.toString())
  timers.value = JSON.parse(url.searchParams.get('timers') ?? '[]')
})
watch(
    timers,
    () => {
      const url = new URL(location.toString())
      url.searchParams.set('timers', JSON.stringify(timers.value))
      history.replaceState({}, '', url.toString())
    },
    {deep: true}
)

// todo: ux, not happy with this
const formattedDuration = computed({
  get() {
    return `${minute1.value}${minute0.value}:${second1.value}${second0.value}`
  },
  set(v) {
    duration.value = toNumber(v)
  }
})
</script>

<template>
  <header>
    <h1 class="visually-hidden">Bart's timely timer thingy</h1>
  </header>
  <main>
    <h2 class="visually-hidden">Timers</h2>
    <AppTimer v-for="t in timers" :duration="t.duration" :title="t.title" :key="t.id"/>
    <form class="box" @submit.prevent="addTimer">
      <h2 class="visually-hidden">Add timer</h2>
      <div><label for="title">Title</label><input type="text" id="title" v-model="title"/></div>
      <div>
        <label for="duration">Duration</label>
        <input type="text" id="duration" ref="durInput" v-model.lazy="formattedDuration"/>
      </div>
      <button type="submit">Add timer</button>
    </form>
  </main>
</template>

<style scoped>

main {
  max-width: 1280px;
  margin-inline: auto;
  padding: 1em;
}

form {
  background: rgba(255, 255, 255, .1);
  display: flex;
  flex-wrap: wrap;
  gap: 2em;
}

form > div {
  display: flex;
  flex-direction: column;
}

label {
  font-weight: bold;
  padding-inline-end: .5em;
}

label, input {
  line-height: 1.6
}

form button {
  font-size: .8rem;
  line-height: 1;
  margin-inline-start: auto;
}
</style>
