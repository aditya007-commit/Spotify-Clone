console.log("Lets write some javascripts");
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutesSeconds(seconds) {
    // Check if input is a valid number
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(folder) {
    currFolder = folder;
    let a = await fetch(`http://127.0.0.1:3000/${folder}/`);  //
    let response = await a.text();
    let div = document.createElement("div");
    div.innerHTML = response;
    let as = div.getElementsByTagName("a");
    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            // songs.push(element.href.split(`/${folder}/`)[1])     // /%5Csongs%
            let songNameEncoded = element.href.split('/').pop();      //gemini
            if (songNameEncoded) {
                // songNameEncoded is "%5Csongs%5Cncs%5CSome Song.mp3"

                // 1. Decode it: "\songs\ncs\Some Song.mp3"
                let songNameDecoded = decodeURIComponent(songNameEncoded);

                // 2. Split by backslash and get the last part: "Some Song.mp3"
                let cleanName = songNameDecoded.split('\\').pop();

                songs.push(cleanName); // Push the clean, decoded name
            }
        }
    }

    // show all the songs in the playlist
    let songUL = document.querySelector(".songList").getElementsByTagName("ul")[0];
    songUL.innerHTML = "";
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `<li><img class="invert" src="img/music.svg" alt="">
                            <div class="info">
                                <div>${decodeURIComponent(song)}</div>      
                                <div>Aditya</div>
                            </div>
                            <div class="playnow">
                                <span>Play Now</span>
                                <img class="invert" src="img/play.svg" alt="">
                            </div> </li>`;  //    ${song.replaceAll("%20", " ")}  //gemini
    }

    // attach an event listener to each song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
        })
    });
    return songs;

}

const playMusic = (track, pause = false) => {
    // let audio = new Audio("/songs/" + track);   ////////////////////////
    currentSong.src = `/${currFolder}/` + track;     ///%5Csongs%5C
    if (!pause) {
        currentSong.play();
    }
    play.src = "img/pause.svg";
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"
}


async function displayAlbums() {
    let a = await fetch(`http://127.0.0.1:3000/songs/`);  //
    let responseText = await a.text();
    let div = document.createElement("div");
    div.innerHTML = responseText;
    let anchors = div.getElementsByTagName("a");
    let cardContainer = document.querySelector(".cardContainer");

    // cardContainer.innerHTML = "";

    // Array.from(anchors).forEach(e=>{      // harry
    //     if(e.href.includes("%5Csongs")){
    //         console.log(e.href.split("/").slice(-2)[0])
    //     }



    // Array.from(anchors).forEach(async e => {      // Gemini
    // if (e.href.includes("%5Csongs")) {
    //     let parts = e.href.split("/").slice(-2);
    //     let a = await fetch(`http://127.0.0.1:3000/songs/${parts}/info.json`);  //
    //     let response = await a.json();
    //     let decodedString = decodeURIComponent(parts[0]);
    //     let folderName = decodedString.split('\\').pop();

    //     // YAHAN BADLAV KIYA GAYA HAI 
    //     console.log(folderName);
    // }


    let array = Array.from(anchors)    // Gemini
        for (let index = 0; index < array.length; index++) {
            const e = array[index];
             

        // 1. IF CONDITION KO BEHTAR BANATE HAIN
        // Yeh check karega ki link 'songs' folder ke andar hai aur ek folder hai (jo '/' pe khatam hota hai)
        if ((e.href.includes("/songs/") || e.href.includes("%5Csongs")) && e.href.endsWith("/") && !e.href.endsWith("/songs/")) {

            // 2. NAAM KO FETCH SE PEHLE SAAF KAREIN
            let parts = e.href.split("/").slice(-2); // parts = ["%5Cncs", ""] (ya "ncs", "")
            let encodedName = parts[0]; // encodedName = "%5Cncs"
            let decodedString = decodeURIComponent(encodedName); // decodedString = "\ncs"
            let folderName = decodedString.split('\\').pop(); // folderName = "ncs"



            // 3. AB SAHI 'folderName' SE FETCH KAREIN
            try {
                // Yahan 'folderName' (jo "ncs" hai) ka istemal ho raha hai
                let a_info = await fetch(`http://127.0.0.1:3000/songs/${folderName}/info.json`);

                if (a_info.ok) { // Check karein ki file mili (404 error toh nahi)
                    let response = await a_info.json(); // JSON ko parse karein

                    // 4. JSON OBJECT (response) KO LOG KAREIN
                    console.log(response);

                    cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folderName}" class="card">
                        <div class="play">
                            <svg width="16" height="16" viewBox="0 0 23 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>
                        <img src="/songs/${folderName}/cover.jpg" alt="">
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`


                } else {
                    console.error(`info.json nahi mila folder '${folderName}' ke liye (404)`);
                }

            } catch (error) {
                // Yeh 'a.json()' fail hone par error dega
                console.error(`JSON error folder '${folderName}' ke liye:`, error);
            }
        }

    }
}

async function main() {
    // get the list of all songs
    await getSongs("songs/ncs");
    // ✅ FIX 1: Check if songs array is empty
    if (songs.length === 0) {           //gemini
        console.error("No songs found in this folder.");
        document.querySelector(".songinfo").innerHTML = "No songs found";
        document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
        return; // Stop the function
    }
    playMusic(songs[0], true)

    // Display all the albums on the page
    await displayAlbums()


    // Attach an event listener to play, net and previous
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play();
            play.src = "img/pause.svg"
        }
        else {
            currentSong.pause();
            play.src = "img/play.svg"
        }
    })

    // Listen for timeupdate event
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    });

    // Add an event listener to seekbar
    document.querySelector(".seekbar").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100;
    })

    // Add an event listener for hamburger
    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0";
    })

    // Add an event listener for close button
    document.querySelector(".close").addEventListener("click", () => {
        document.querySelector(".left").style.left = "-120%";
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        console.log("Previous clicked");
        // let index = songs.indexOf(currentSong.src.split("%5C").slice(-1)[0]);  //harry

        // Get the current song's filename, decode it, and find it in the array
        let currentTrackName = decodeURIComponent(currentSong.src.split("/").pop());  //gemini
        let index = songs.indexOf(currentTrackName);

        if ((index - 1) >= 0) {       //gemini
            // Agar yeh pehla gaana nahi hai, toh pichla gaana play karo
            playMusic(songs[index - 1]);
        } else {
            // Agar yeh pehla gaana hai, toh last gaane par jao (wrap-around)
            playMusic(songs[songs.length - 1]);
        }

    })

    // Add an event listener to next 
    next.addEventListener("click", () => {
        console.log("Next clicked");
        // let index = songs.indexOf(currentSong.src.split("%5C").slice(-1)[0]);  //harry

        // Get the current song's filename, decode it, and find it in the array
        let currentTrackName = decodeURIComponent(currentSong.src.split("/").pop());   //gemini
        let index = songs.indexOf(currentTrackName);

        if ((index + 1) < songs.length) {   //gemini
            // Agar yeh last gaana nahi hai, toh agla gaana play karo
            playMusic(songs[index + 1]);
        } else {
            // Agar yeh last gaana hai, toh pehle gaane par jao (wrap-around)
            playMusic(songs[0]);
        }
    })

    // Add an event listener to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
        console.log("Setting volume to", e.target.value, "/ 100");
        currentSong.volume = parseInt(e.target.value) / 100;
        if(currentSong.volume >0){
            document.querySelector(".volume>img").src = document.querySelector(".volume>img").src.replace("mute.svg", "volume.svg")
        }
    })

    // Load the playlist whenever card is clicked
    Array.from(document.getElementsByClassName("card")).forEach(e => {
        e.addEventListener("click", async item => {
            songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`);
            playMusic(songs[0])
        })
    })

    // Add event listener mute the track
    document.querySelector(".volume>img").addEventListener("click", e=>{
        if(e.target.src.includes("volume.svg")){
            e.target.src = e.target.src.replace("volume.svg", "mute.svg")
            currentSong.volume = 0;
            document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
        }
        else{
            e.target.src = e.target.src.replace("mute.svg", "volume.svg")
            currentSong.volume = .10
            document.querySelector(".range").getElementsByTagName("input")[0].value = 10;
        }
    })

}

main();