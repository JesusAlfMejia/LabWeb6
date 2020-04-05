const key = "AIzaSyDlO8Etdrgpp8LrvFwUe6H0-zM1-ZY4WeI";
let searchedWord = "";

function watchForm(){
    let searchBtn = document.querySelector('#searchBtn');
    let showMoreBtn = document.querySelector('#nextPage');
    showMoreBtn.style.display = 'none';
    searchBtn.addEventListener("click", event =>{
        searchedWord = document.querySelector('#searchBar').value;
        let url = `https://www.googleapis.com/youtube/v3/search?&maxResults=10&part=snippet&type=video&key=${key}&q=${searchedWord}`;
        let resultsDiv = document.querySelector('#videoList');
        resultsDiv.innerHTML = "";
        getVideos(event, url)
    });

}

function init(){
    watchForm();
}

function getVideos(event, url){
    event.preventDefault();
    let resultsDiv = document.querySelector('#videoList');
    fetch(url)
        .then(response => {
            if(response.ok){
                return response.json();
            }else{
                throw new Error(response.statusText);
            }
    })
        .then( myJson =>{
            showVideos(myJson);
        })
        .catch(error =>{
        console.log(error);
    })

}

function showVideos(myJson) {
    console.log(myJson);
    let resultsDiv = document.querySelector('#videoList');
    for(let i=0; i<10; i++){
        newDiv = document.createElement('div');
        let videoUrl = "https://www.youtube.com/watch?v=" + myJson.items[i].id.videoId;
        newDiv.innerHTML = `
        <h2>${myJson.items[i].snippet.title}</h2>
        <a href=${videoUrl} target="_blank">
            <img src=${myJson.items[i].snippet.thumbnails.high.url} 
        </a>
        `
        resultsDiv.appendChild(newDiv)
    };
    let showMoreBtn = document.querySelector('#nextPage');
    showMoreBtn.style.display = 'block';
    var fun = function (event){
        showMoreBtn.removeEventListener("click", fun);
        let url = `https://www.googleapis.com/youtube/v3/search?&pageToken=${myJson.nextPageToken}&maxResults=10&part=snippet&type=video&key=${key}&q=${searchedWord}`;
        console.log(myJson.nextPageToken);
        getVideos(event, url);
    }
    showMoreBtn.addEventListener("click", fun);

}

init();