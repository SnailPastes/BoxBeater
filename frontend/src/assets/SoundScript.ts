type SoundControl = {
    play: () => void
    stop: () => void
    toggle: (state: boolean) => void
  }
  
  export function createSoundControls(sounds: string[]): Record<string, SoundControl> {
    const controls: Record<string, SoundControl> = {}
    
    sounds.forEach(sound => {
      controls[sound] = {
        play: () => (document.getElementById(sound) as HTMLAudioElement)?.play(),
        stop: () => {
          const audio = document.getElementById(sound) as HTMLAudioElement
          audio.pause()
          audio.currentTime = 0
        },
        toggle: (state: boolean) => {
          const audio = document.getElementById(sound) as HTMLAudioElement
          audio.loop = state
          state ? audio.play() : audio.pause()
        }
      }
    })
    
    return controls
  }
  
//   export function setupContextMenu(menuElement) {

//       const menu = document.getElementById('dropdownMenu')
      
//       document.addEventListener('contextmenu', function(e){
//           if(e.target.classList.contains('background')){
//               e.preventDefault();
          
//               menu.style.left = `${e.pageX}px`;
//               menu.style.top = `${e.pageY}px`;
//               menu.style.display = 'block';
//           }
      
//           else{
//               menu.style.display = 'none';
//           }
//       });
      
//       menu.addEventListener('mouseleave', () => {
//           setTimeout(() => {
//               if (!menu.matches(':hover')) {
//                   menu.style.display = 'none';
//               }
//           }, 200); 
//       });
      
//       document.addEventListener('click', () => {
//           menu.style.display = 'none';
//       })
//   }

