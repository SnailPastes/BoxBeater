<script setup lang="ts">
import { ref, onMounted } from "vue";
import drumKickUrl from "../assets/sound-effects/Drum-Kick.mp3?url";
import drumSnareUrl from "../assets/sound-effects/Drum-Snare.mp3?url";


// Store sounds and their elements
const sounds = ref([
  { name: "Kicks", src: drumKickUrl, checked: false },
  { name: "Snare", src: drumSnareUrl, checked: false }
]);

const audioContext = new AudioContext();
const destination = audioContext.createMediaStreamDestination();
const mediaRecorder = ref<MediaRecorder | null>(null);
const recordedChunks = ref<Blob[]>([]);
const isRecording = ref(false);

function toggleSound(sound: typeof sounds.value[0]) {
  const audio = document.getElementById(sound.name) as HTMLAudioElement | null;
  if (!audio) return;

  if (sound.checked) {
    audio.loop = true;
    audio.play().catch((err) => console.warn("Playback failed:", err));
  } else {
    audio.pause();
    audio.currentTime = 0;
  }
}

function setupAudioRouting() {
  sounds.value.forEach((sound) => {
    const audioEl = document.getElementById(sound.name) as HTMLAudioElement | null;
    if (audioEl) {
      const source = audioContext.createMediaElementSource(audioEl);
      source.connect(destination);
      source.connect(audioContext.destination);
    }
  });

  mediaRecorder.value = new MediaRecorder(destination.stream);
  mediaRecorder.value.ondataavailable = (e) => {
    recordedChunks.value.push(e.data);
  };
  mediaRecorder.value.onstop = () => {
    const blob = new Blob(recordedChunks.value, { type: "audio/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.className = "download-link";
    a.href = url;
    a.download = "recording.mp3";
    a.textContent = "Download Recording";
    document.body.appendChild(a);

    Object.assign(a.style, {
      display: "inline-block",
      marginTop: "20px",
      padding: "10px 20px",
      backgroundColor: "aqua",
      color: "black",
      borderRadius: "10px",
      textDecoration: "none",
      alignItems: "center",
      textAlign: "center",
    });

    document.body.appendChild(a);
  };
}

async function toggleRecording() {
  if (!mediaRecorder.value) return;

  // Resume the audio context first!
  if (audioContext.state === "suspended") {
    await audioContext.resume();
  }

  if (!isRecording.value) {
    recordedChunks.value = [];
    mediaRecorder.value.start();
    isRecording.value = true;
  } else {
    mediaRecorder.value.stop();
    isRecording.value = false;
  }
}



onMounted(() => {
  setupAudioRouting();
});


function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (!file) return;

  const url = URL.createObjectURL(file);
  const name = file.name.replace(/\.[^/.]+$/, "");

  sounds.value.push({
    name,
    src: url,
    checked: false
  });
}
</script>

<template>

  <div class="container">
    <div v-for="sound in sounds" :key="sound.name">
      <audio :id="sound.name" :src="sound.src" preload="auto"></audio>

      <label class="soundName">
        <input type="checkbox" v-model="sound.checked" @change="toggleSound(sound)" />
        <span class="background">{{ sound.name }}</span>
      </label>
    </div>
    <label id="AddBtn">
      +
      <input type="file" accept="audio/mp3" @change="handleFileUpload" hidden />
    </label>
  </div>

  <button @click="toggleRecording" class="record-button">
    {{ isRecording ? "Stop Recording" : "Start Recording" }}
  </button>

</template>

<style scoped>
.record-button {
  position: fixed;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: crimson;
  color: white;
  padding: 15px 25px;
  border: none;
  border-radius: 30px;
  font-size: 16px;
  cursor: pointer;
  z-index: 100;
}

.record-button:hover {
  background-color: darkred;
}

.container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  min-height: 20vh;
  text-align: center;
  gap: 20px;
  margin-left: 115px;
}

#AddBtn {
  background-color: rgb(255, 255, 255);
  padding: 20px;
  cursor: pointer;
  border-radius: 10px;
  outline-color: aqua;
  outline-style: solid;
  outline-width: 5px;
  width: 100px;
}

.soundName {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.soundName {
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.soundName input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}

.background {
  display: inline-block;
  cursor: pointer;
  background-color: aqua;
  color: black;
  border-radius: 10px;
  padding: 25px;
  margin: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  transition: background-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
}

.background:hover {
  background-color: blue;
}

.soundName input:checked+.background {
  background-color: blue;
  color: white;
  box-shadow: 0 0px 0px rgba(0, 0, 0, 0.4);
}
</style>