const sounds = ['Kicks']

sounds.forEach(sound=> {
    const label = document.createElement('label');
    label.classList.add('soundName');


    const soundToggle = document.createElement('input');
    soundToggle.type='checkbox';

    const background = document.createElement('span');
    background.classList.add('background');
    background.textContent = sound;

    label.appendChild(soundToggle);
    label.appendChild(background);

    soundToggle.addEventListener('change', function(){
        const audio = document.getElementById(sound);
        if(this.checked) {
            audio.loop = true;
            audio.play();
        }
        else{
            audio.loop = false;
            stopPlaying();
        }
    });

    document.getElementById('checkboxes').appendChild(label);
});

const menu = document.getElementById('dropdownMenu')

document.addEventListener('contextmenu', function(e){
    if(e.target.classList.contains('background')){
        e.preventDefault();
    
        menu.style.left = $;{e.pageX}px;
        menu.style.top = $;{e.pageY}px;
        menu.style.display = 'block';
    }

    else{
        menu.style.display = 'none';
    }
});

menu.addEventListener('mouseleave', () => {
    setTimeout(() => {
        if (!menu.matches(':hover')) {
            menu.style.display = 'none';
        }
    }, 200); 
});

document.addEventListener('click', () => {
    menu.style.display = 'none';
})


function stopPlaying(){
    sounds.forEach(sound =>{
        const audio = document.getElementById(sound);
        audio.pause();
        audio.currentTime = 0;
    })
}
