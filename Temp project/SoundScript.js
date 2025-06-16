const sounds = ["Kicks"];

sounds.forEach((sound) => {
  const label = document.createElement("label");
  label.classList.add("soundName");

  const soundToggle = document.createElement("input");
  soundToggle.type = "checkbox";

  const background = document.createElement("span");
  background.classList.add("background");
  background.textContent = sound;

  label.appendChild(soundToggle);
  label.appendChild(background);

  soundToggle.addEventListener("change", function () {
    const audio = document.getElementById(sound);
    if (this.checked) {
      audio.loop = true;
      audio.play();
    } else {
      audio.loop = false;
      stopPlaying();
    }
  });

  document.getElementById("checkboxes").appendChild(label);
});

const menu = document.getElementById("dropdownMenu");

function stopPlaying() {
  sounds.forEach((sound) => {
    const audio = document.getElementById(sound);
    audio.pause();
    audio.currentTime = 0;
  });
}
