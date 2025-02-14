console.log("script is working")

let currentSong = new Audio();
let songs;

function convertToMinutesSeconds(totalSeconds) {
    if(isNaN(totalSeconds) || totalSeconds<0){
        return"00:00";
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    
    // Ensure both minutes and seconds are always two digits
    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(seconds).padStart(2, '0');
    
    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs() {

    let a = await fetch("./songs/");
    let response = await a.text();
    
    let div = document.createElement("div")
    div.innerHTML = response;
    songs = []
    let links = div.getElementsByTagName("a")
    for (let index = 0; index < links.length; index++) {
        const element = links[index]
        if (element.href.endsWith("mp3")) {
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}

const playMusic = (track,pause = false) => {
    currentSong.src = "/songs/" + track
    if(!pause){

        currentSong.play();
        play.src = "svgs/pause.svg"
    }
    document.querySelector(".songinfo").innerHTML =decodeURI( track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function main() {

    // Fetch songs and display them in the console
    let songs = await getSongs();

    playMusic(songs[0],true)

    // show all the songs in the playlist
    let songUl = document.querySelector(".songList").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUl.innerHTML = songUl.innerHTML + `<li>
                                    <img class="invert" src ="svgs/music.svg" alt="">
                                    <div class="info">
                                        <div>${song.replaceAll("%20", " ")}</div>
                                        <div>Atif Aslam</div>
                                    </div>
                                    <div class="playnow">
                                        <span>Play now</span>
                                        <img class="invert" src="svgs/play.svg" alt="">
                                    </div>
        </li>`
    }
    // Attach an eventlistener to each song

    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info> div").innerHTML.trim())
        })
    })

    // attach an eventlistener to play button

    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "svgs/pause.svg"

        }
        else {
            currentSong.pause()
            play.src = "svgs/play.svg"
        }
    })

    // listen for time update event
    currentSong.addEventListener("timeupdate",()=>{
        document.querySelector(".songtime").innerHTML= `${convertToMinutesSeconds(currentSong.currentTime)} / ${convertToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left =     (currentSong.currentTime/currentSong.duration)*100 +"%"

    })
    // add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent =  ((e.offsetX/e.target.getBoundingClientRect().width))*100
        document.querySelector(".circle").style.left =percent+"%"
        currentSong.currentTime = ((currentSong.duration)*percent)/100
    })
    // addEventListener to hambuger 
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "0%"

    })
        // addEventListener to close 
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left = "-100%"

    })
    // add event listener to previous and next
    previous.addEventListener("click",()=>{
        console.log("previousClicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if (index-1>=0){
            playMusic(songs[index-1])
         }
    })
        
    
    next.addEventListener("click",()=>{
        console.log("nextClicked")  
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index+1) < songs.length){
           playMusic(songs[index+1])
        }

    })
    // add an event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        currentSong.volume = parseInt(e.target.value)/100
    })
    }
    
main()
