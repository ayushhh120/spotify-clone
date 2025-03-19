let currentSong = new Audio();
let songs;
let currFolder;

// convert seconts into minute function
function convertSecondsToTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}

async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/songs/${folder}/info.json`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3") || element.href.endsWith(".m4a")) {
      songs.push(element.href.split(`${folder}/`)[1]);
    }
  }

  // show all the songs in the playlist
  let songUl = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
  songUl.innerHTML = "";
  for (const song of songs) {
    songUl.innerHTML =
      songUl.innerHTML +
      `<li>
                <img class="invert" src="img/music.svg" alt="">
                <div class="info">
                  <div> ${song.replaceAll("%20", " ")}</div>
                  <div>Ayush</div>
                </div>
                <div class="playnow">
                  <span>Play Now</span>
                  <img class="invert" src="img/play.svg" alt="">
                </div> </li>`;
  }

  // attach an eventlistner to each songs

  Array.from(
    document.querySelector(".songList").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}
const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;

  if (!pause) {
    currentSong.play();
    play.src = "img/pause.svg";
  }
  document.querySelector(".songInfo").innerHTML = decodeURI(track);
  document.querySelector(".songTime").innerHTML = " 00:00 / 00:00";
};

// display albums function
async function displayAlbums( ){
    let a = await fetch(`./songs/albums.json`);
    let albums = await a.json();
    let cardContainer = document.querySelector(".cardContainer")
    albums.forEach(album=>{                 
        cardContainer.innerHTML += `<div data-folder="${album.folder}" class="card">
        <div class= "play"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="40" height="40">
          <circle cx="12" cy="12" r="12" fill="#1FDF64"/>
          <g transform="scale(0.8) translate(3,3)">
              <path d="M18.8906 12.846C18.5371 14.189 16.8667 15.138 13.5257 17.0361C10.296 18.8709 8.6812 19.7884 7.37983 19.4196C6.8418 19.2671 6.35159 18.9776 5.95624 18.5787C5 17.6139 5 15.7426 5 12C5 8.2574 5 6.3861 5.95624 5.42132C6.35159 5.02245 6.8418 4.73288 7.37983 4.58042C8.6812 4.21165 10.296 5.12907 13.5257 6.96393C16.8667 8.86197 18.5371 9.811 18.8906 11.154C19.0365 11.7084 19.0365 12.2916 18.8906 12.846Z" stroke="black" stroke-width="1.5" stroke-linejoin="round" fill="black"/>
          </g>
      </svg>
      </div>
        <img src="${album.cover}">
        <h4>${album.title}</h4>
        <p>${album.description}</p>
      </div>`;
    })}


// get lists of all songs
async function main() {
  await getSongs("./songs/LatestFavorites");
  playMusic(songs[0], true);

// display all the albums on the page
 displayAlbums()

  // attach an event listner to play next and previous
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "img/pause.svg";
    } else {
      currentSong.pause();
      play.src = "img/play.svg";
    }
  });
  // time update function
  currentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songTime").innerHTML = `${convertSecondsToTime(
      currentSong.currentTime
    )}/${convertSecondsToTime(currentSong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentSong.currentTime / currentSong.duration) * 100 + "%";
  });

  // add an event listner to seekbar
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = (currentSong.duration * percent) / 100;
  });

  // add an eventlistner to hamburger
  document.querySelector(".hamBurger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // add an eventlistner to close button
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
  // add an eventlistner to songlist close effect
  document.querySelector(".songList").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });
// add an eventlistner to songlist open effect on mobile device while clicking on card
  document.querySelector(".cardContainer").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });

  // add an event listner to previous and next button
  previous.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });
  next.addEventListener("click", () => {
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });
  // add an event listner to volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentSong.volume = parseInt(e.target.value) / 100;
    });

  // load the playlist whenever card is clicked
  document.querySelector(".cardContainer").addEventListener("click", async (event) => {
    let card = event.target.closest(".card");
    if (!card) return; 

    let folder = card.dataset.folder; 
    if (!folder) return; 

    await getSongs(`songs/${folder}`);
    playMusic(songs[0])

});

// add event listner to mute volume button
document.querySelector(".volume>img").addEventListener("click", e=>{
  if(e.target.src.includes("img/volume.svg")){
    e.target.src = e.target.src.replace("volume.svg","mute.svg")
    currentSong.volume = 0;
    document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value = 0
  }
  else{
    e.target.src = e.target.src.replace("mute.svg","volume.svg")
    currentSong = 0.10
    document
    .querySelector(".range")
    .getElementsByTagName("input")[0].value = 10

  }

}) 
}
main();