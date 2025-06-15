<script setup lang="ts">
import { onMounted, ref } from "vue";

type SoundControl = {
  play: () => void;
  stop: () => void;
  toggle: (state: boolean) => void;
};

const sounds = ref(["Kicks"]);
const soundControls = ref<Record<string, SoundControl>>();

// Rekaman
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordedChunks = ref<Blob[]>([]);
const isRecording = ref(false);

function createSoundControls(sounds: string[]): Record<string, SoundControl> {
  const controls: Record<string, SoundControl> = {};

  sounds.forEach((sound) => {
    const audioElement = document.getElementById(
      sound
    ) as HTMLAudioElement | null;

    if (!audioElement) {
      console.warn(`Audio element with id ${sound} not found`);
      return;
    }

    controls[sound] = {
      play: () => audioElement.play(),
      stop: () => {
        audioElement.pause();
        audioElement.currentTime = 0;
      },
      toggle: (state: boolean) => {
        audioElement.loop = state;
        state ? audioElement.play() : audioElement.pause();
      },
    };
  });

  return controls;
}

onMounted(() => {
  soundControls.value = createSoundControls(sounds.value);
});

// 🎵 Add sound
function addSound() {
  const name = prompt("Enter sound name (e.g., Clap)");
  const url = prompt("Enter full audio URL or relative path from /public");

  if (!name || !url) return;

  sounds.value.push(name);

  const audio = document.createElement("audio");
  audio.src = url;
  audio.id = name;
  document.body.appendChild(audio);

  // Recreate sound controls
  soundControls.value = createSoundControls(sounds.value);
}

// 🎤 Record sound
async function startRecording() {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.value = new MediaRecorder(stream);

    recordedChunks.value = [];
    mediaRecorder.value.ondataavailable = (e) => {
      if (e.data.size > 0) recordedChunks.value.push(e.data);
    };

    mediaRecorder.value.start();
    isRecording.value = true;
    console.log("Recording started...");
  } catch (error) {
    alert("Microphone access denied.");
    console.error(error);
  }
}

function stopRecording() {
  if (mediaRecorder.value) {
    mediaRecorder.value.stop();
    isRecording.value = false;
    console.log("Recording stopped.");
  }
}

// 💾 Export to WebM (or MP3 if pakai library tambahan)
function exportRecording() {
  const blob = new Blob(recordedChunks.value, { type: "audio/webm" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "recorded_audio.webm";
  a.click();
  URL.revokeObjectURL(url);
}
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

  <!-- Existing Audio -->
  <audio src="@/assets/sound-effects/Drum Kick.mp3" id="Kicks"></audio>

  <!-- 🎛 Controls -->
  <div class="control-panel">
    <button @click="addSound">➕ Add Sound</button>
    <button v-if="!isRecording" @click="startRecording">
      🔴 Start Recording
    </button>
    <button v-if="isRecording" @click="stopRecording">⏹ Stop Recording</button>
    <button :disabled="recordedChunks.length === 0" @click="exportRecording">
      💾 Export Recording
    </button>
  </div>

  <!-- Optional menu -->
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
.control-panel {
  margin-top: 20px;
  display: flex;
  gap: 10px;
}
button {
  padding: 6px 12px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background-color: #3498db;
  color: white;
  font-weight: bold;
}
button:disabled {
  background-color: #aaa;
  cursor: not-allowed;
}
</style>
