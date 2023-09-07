import { computed } from 'vue'
import type { Ref } from 'vue'

export const useTime = function (seconds: Ref<number>) {
  const minute1 = computed((): number => Math.floor(seconds.value / 600))
  const minute0 = computed((): number => Math.floor(seconds.value / 60) % 10)
  const second1 = computed((): number => Math.floor((seconds.value % 60) / 10))
  const second0 = computed((): number => (seconds.value % 60) % 10)

  function toNumber(text: string): number {
    const numbers = text.match(/\d/g)?.map((v) => +v)
    if (!numbers) return 0
    return (
      (numbers[0] || 0) * 600 + (numbers[1] || 0) * 60 + (numbers[2] || 0) * 10 + (numbers[3] || 0)
    )
  }

  return { minute1, minute0, second1, second0, toNumber }
}
