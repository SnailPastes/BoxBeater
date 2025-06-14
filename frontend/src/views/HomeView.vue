<script setup lang="ts">
import { onMounted, ref } from 'vue'

type SoundControl = {
  play: () => void
  stop: () => void
  toggle: (state: boolean) => void
}

function createSoundControls(sounds: string[]): Record<string, SoundControl> {
  const controls: Record<string, SoundControl> = {}
  
  sounds.forEach(sound => {
    const audioElement = document.getElementById(sound) as HTMLAudioElement | null
    
    if (!audioElement) {
      console.warn(`Audio element with id ${sound} not found`)
      return
    }

    controls[sound] = {
      play: () => audioElement.play(),
      stop: () => {
        audioElement.pause()
        audioElement.currentTime = 0
      },
      toggle: (state: boolean) => {
        audioElement.loop = state
        state ? audioElement.play() : audioElement.pause()
      }
    }
  })
  
  return controls
}

const sounds = ref(['Kicks'])
const soundControls = ref<Record<string, SoundControl>>()

onMounted(() => {
  soundControls.value = createSoundControls(sounds.value)
})
</script>

<template>
  <div id="checkboxes">
    <label v-for="sound in sounds" :key="sound" class="sound-name">
      <input 
        type="checkbox" 
        @change="(e) => soundControls?.[sound]?.toggle((e.target as HTMLInputElement).checked)"
      />
      <span class="background">{{ sound }}</span>
    </label>
  </div>

  <audio src="@/assets/sound-effects/Drum Kick.mp3" id="Kicks"></audio>

  <div id="dropdownMenu" class="menu">
    <ul>
      <li>Volume</li>
      <li>Duration</li>
      <li>Loop</li>
    </ul>
  </div>
</template>

<style scoped>
.sound-name {
  display: flex;
  align-items: center;
  margin: 8px 0;
  cursor: pointer;
}

.menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  display: none;
}
</style>

