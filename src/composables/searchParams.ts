import { onBeforeMount, ref, watch } from 'vue'
import type { UnwrapRef } from 'vue'

export const useSearchParams = function <T extends Record<string, any>>(initial = {}) {
  const params = ref<T>(initial as T)

  onBeforeMount(() => {
    const searchParams = new URL(location.toString()).searchParams
    const entries = Array.from(searchParams.entries()).map(([key, value]) => [
      key,
      JSON.parse(value)
    ])
    params.value = {
      ...params.value,
      ...(Object.fromEntries(entries) as UnwrapRef<T>)
    }
  })

  watch(
    params,
    () => {
      const url = new URL(location.toString())
      Object.entries(params.value).forEach(([key, value]) =>
        url.searchParams.set(key, JSON.stringify(value))
      )
      history.replaceState({}, '', url.toString())
    },
    { deep: true }
  )

  return {
    params
  }
}
