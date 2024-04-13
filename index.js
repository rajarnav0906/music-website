let currentSong = new Audio;
let songs;

//function to covert the seconds to minutes and seconds
function secondsToMinutesAndSeconds(seconds) {
    if(isNaN(seconds) || seconds<0){
        return "00:00";
    }
    var minutes = Math.floor(seconds / 60);
    var remainingSeconds = Math.floor(seconds % 60); // Round down to remove milliseconds

    // Add leading zeros if needed
    var minutesStr = (minutes < 10) ? "0" + minutes : minutes;
    var secondsStr = (remainingSeconds < 10) ? "0" + remainingSeconds : remainingSeconds;

    return minutesStr + ":" + secondsStr;
}


async function getSongs(){
    //fetching all the songs 
    let a = await fetch("./songs/");
    let response = await a.text();
    //creating a div to add all the songs which came from fetch API 
    /*we created a div because a.text() is returning the data in the form of a table so we have to 
    access the data from the table and hence we created a div to store and then access it */
    
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    let songs = [];
    for(let i=0; i<as.length; i++){
        let element = as[i];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1]);
        }
    }

    return songs;
    
}


// to play any music 

function playMusic(track, pause = false){
    currentSong.src = ("/songs/" + track);
    if(!pause){
        currentSong.play();
        play.src = "./pause.svg";
    }
    
    
    document.querySelector(".songinfo").innerHTML = decodeURI(track);
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
}


getSongs()
    .then((songs) => {
        //by default play the first song
        playMusic(songs[0], true);
       

        //to show all the songs in the playlist 
        let songUL = document.querySelector(".songsList").getElementsByTagName("ul")[0];
        for (const song of songs){
            songUL.innerHTML = songUL.innerHTML + `<li>
                    <img src="./music.svg">
                    <div class="info">
                        <div>${song.replaceAll("%20", " ")}</div>
                        
                    </div>
                    <div class="playnow">
                        <span>Play Now</span>
                        <img src="./play.svg">
                    </div>           
            </li>`;
        }
        /*ab jaise he list aa gya songs ka playlist me (jo ki left side me dikh rha hai)
        ....ab usme iterate kro aur gaana ka naam nikalo
        'array from' ek array bna deta hai
        'for each' iterate krta hai array me  
        */
        //attaching event listenner to songs

        Array.from(document.querySelector(".songsList").getElementsByTagName("li")).forEach(element => {
            // console.log(element);
            element.addEventListener("click", () => {
                playMusic(element.querySelector(".info").getElementsByTagName("div")[0].innerHTML.trim());
                // console.log(element.querySelector(".info").getElementsByTagName("div")[0].innerHTML);
            })
                
        });


        //attaching event listener to play, pause and previous and next
        //here play is the id given to the play button in html
        play.addEventListener("click", () => {
            if(currentSong.paused){
                currentSong.play();
                play.src = "./pause.svg";

            }
            else{
                currentSong.pause();
                play.src = "./play.svg"
            }
        })


        //listen for time update event
        currentSong.addEventListener("timeupdate", () => {
            // console.log(currentSong.currentTime, currentSong.duration)
            document.querySelector(".songtime").innerHTML = `${secondsToMinutesAndSeconds(currentSong.currentTime)} / ${secondsToMinutesAndSeconds(currentSong.duration)}`;

            document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) *100 +"%";
        })


        //adding event listener to seekbar
        document.querySelector(".seekbar").addEventListener("click", (e) => {
            let percent = ((e.offsetX / e.target.getBoundingClientRect().width) * 100);
            // console.log(e.target.getBoundingClientRect().width, e.offsetX);
            document.querySelector(".circle").style.left = percent + "%";
            currentSong.currentTime = (currentSong.duration * percent)/100;
        })


        //add event listener to hamburger menu
        document.querySelector(".hamburger").addEventListener("click", () => {
            document.querySelector(".left").style.left = "0";
        })

        //add event listener to close
        document.querySelector(".close").addEventListener("click", () => {
            document.querySelector(".left").style.left = "-135%";
        })
        
        //add event listener for previous
        previous.addEventListener("click", () => {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
            if((index-1) >= 0){
                playMusic(songs[index-1])
            }
            
        })
        
        //add event listener for next
        next.addEventListener("click", () => {
            let index = songs.indexOf(currentSong.src.split("/").slice(-1) [0]);
            if((index+1) < songs.length){
                playMusic(songs[index+1])
            }
            
        })

        //add event to volume
        document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
            // console.log(e);
            currentSong.volume = (e.target.value)/100;
        })

    }).catch((error) => {
        console.log("error");
    })

