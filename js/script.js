console.log("Hello World")
let currentsong = new Audio()
let song;
let  curfolder
let songs 

async function getsong(folder) {
    let response = await fetch(`song/${folder}/`);
    let data = await response.text();
    curfolder = folder

    let div = document.createElement("div")
    div.innerHTML = data;
    let as = div.getElementsByTagName("a")
    // console.log(a)
    songs = []
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/%5Csong%5C${folder}%5C`)[1])
            
        } 


    }


    let songul = document.querySelector(".songbar").getElementsByTagName("ul")[0]
    songul.innerHTML = ""
    for (const gana of songs) {
        songul.innerHTML = songul.innerHTML + `<li>
                                <div id = "${gana.replaceAll("%20", " ")}" class="songformat flex">
                                   <div>${gana.replaceAll("%20", " ")}</div>
                                   <div class = "songplay flex">

                                       <span>Play</span>
                                       <img src="images/play.svg">
                                   </div>
                                
                                </div>
                            </li>`
    }
  Array.from(document.querySelector(".songbar").getElementsByTagName("li")).forEach(e => {
        e.addEventListener("click", element => {

            console.log(e.querySelector(".songformat").firstElementChild.innerHTML)
            playMp3(e.querySelector(".songformat").firstElementChild.innerHTML)
        })
    })



}
const playMp3 = (track, pause = false) => {
    // let audio = new Audio("/%5Csong%5C"+ track)
    currentsong.src = `/%5Csong%5C${curfolder}%5C` + track
    if (!pause) {

        currentsong.play()
        play.src = "images/pause.svg"

    }

    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".duration").innerHTML = "00:00/00:00"

}
function formatTimeFromSeconds(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) return "00:00";
    let m = Math.floor(totalSeconds / 60);
    let s = Math.floor(totalSeconds % 60);
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

// Wait until metadata is ready
currentsong.addEventListener("loadedmetadata", () => {
    document.querySelector(".duration").innerHTML =
        `${formatTimeFromSeconds(currentsong.currentTime)} / ${formatTimeFromSeconds(currentsong.duration)}`;
});
async function displayalbum(){
    let a = await fetch(`song/`);
    // console.log(response)
     let response = await a.text();
     let div = document.createElement("div")
     div.innerHTML = response;
     console.log(div)
     let anchor = div.getElementsByTagName("a")
     let array = Array.from(anchor)
     console.log(array)
     for(let items = 0; items<array.length ; items++){
        if(array[items].href.includes("%5Csong%5C")){
            console.log(array[items].href);
            let decode = decodeURI(array[items].href);
            let parts = decode.split("\\");
            let fold = parts[parts.length - 1].replace("/", "");
            console.log(fold)
            let b = await fetch(`song/${fold}/info.json`);
            // console.log(response)
              let response1 = await b.json();
              console.log(response1)

            let cardContainer = document.querySelector(".songcontainer")
            cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder = "${fold}" class="card">
                    <div class="play">
                        <img src="images/play-button.png" alt="">
                    </div>
                    <img src="song/${fold}/cover.jpg">
                    <h2>${response1.Title}</h2>
                    <h3>${response1.Description}</h3>
                </div>`
            
        }
     }
     Array.from(document.getElementsByClassName("card")).forEach(element => {
    element.addEventListener("click",async item=>{
        
      await getsong(`${item.currentTarget.dataset.folder}`)

    })


    
   });

     

}


async function main() {
    displayalbum()
    await getsong("Arijit-Singh")
    console.log(songs)
    playMp3(songs[0], true)

   
    
    play.addEventListener("click", () => {
        if (currentsong.paused) {
            currentsong.play()
            play.src = "images/pause.svg"
        } else {
            currentsong.pause()
            play.src = "images/play.svg"

        }
    })
    currentsong.addEventListener("timeupdate", () => {
        document.querySelector(".duration").innerHTML =
            `${formatTimeFromSeconds(currentsong.currentTime)} / ${formatTimeFromSeconds(currentsong.duration)}`;
        document.querySelector(".circle").style.left = (currentsong.currentTime / currentsong.duration) * 100 + "%"

    });
    document.querySelector(".seekbar").addEventListener("click", e => {
        console.log((e.offsetX / e.target.getBoundingClientRect().width))
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentsong.currentTime = (currentsong.duration * percent) / 100



    })
    document.querySelector(".hamburger").addEventListener("click", () => {
        if (document.querySelector(".left").style.left == "0%") {
            document.querySelector(".left").style.left = "-100%"
        } else {

            document.querySelector(".left").style.left = "0%"
            if (document.querySelector(".contentofnav").style.right == "0%") {
                document.querySelector(".contentofnav").style.right = "-100%"
            }
        }
    })
    document.querySelector(".hamburgernav").addEventListener("click", () => {
        if (document.querySelector(".contentofnav").style.right == "-150%") {
            document.querySelector(".contentofnav").style.right = "0%"
            if (document.querySelector(".left").style.left == "0%") {
                document.querySelector(".left").style.left = "-100%"

            }

        } else {

            document.querySelector(".contentofnav").style.right = "-150%"
        }




    })
    prev.addEventListener("click", () => {
        console.log("You click the prev button")
        console.log()
        let str = currentsong.src.split("/").slice(-1)[0]
        let cleanStr = str.replace(`%5Csong%5C${curfolder}%5C`, "");

        let index = songs.indexOf(cleanStr)
        console.log(songs, index)
        if(index-1 >=0){
            currentsong.pause();
            playMp3(songs[index-1]);
        }

    })
    next.addEventListener("click", () => {
        console.log("You click the prev button")
        console.log()
        let str = currentsong.src.split("/").slice(-1)[0]
        let cleanStr = str.replace(`%5Csong%5C${curfolder}%5C`, "");

        let index = songs.indexOf(cleanStr)
        console.log(songs, index)
        if(index+1 < songs.length){
            currentsong.pause();
            playMp3(songs[index+1]);
        }

    })
    volc.addEventListener("change" , (e)=>{
        // console.log(e, e.target , e.target.value )
        currentsong.volume = parseInt(e.target.value)/100;
        if(e.target.value == 0){
            document.querySelector(".volumeimage").src = "images/volumemute.svg"
        }else{
            document.querySelector(".volumeimage").src = "images/volume.svg"

        }
    })
   document.querySelector(".close").addEventListener("click", ()=>{
    document.querySelector(".left").style.left = "-100%"
   })


}


main()