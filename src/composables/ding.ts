const ding = new Audio(new URL('@/assets/ding.wav', import.meta.url).href)

export const useDing = function (): { play: () => void } {

  function play() {
    ding.currentTime = 0
    ding.play()
  }

  return { play }
}
