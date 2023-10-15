const parentElement = document.querySelector(".main");
const searchInput = document.querySelector(".input");
const movieRatings = document.querySelector("#rating-select");
const genreRatings = document.querySelector("#genre-select");
const movieGenres = document.querySelector("#genre-select");

let searchValue="";
let ratings=0;
let genre = "";
let filteredArrOfMovies=[];

const URL="https://movies-app.prakashsakari.repl.co/api/movies";
const getMovies = async (url) => {
    try{
        // const {data}={config: confiVAlue, data: [{},{}], status: 200, headers: abcd} // Destructuring
        const {data} = await axios.get(url);
        // console.log(data);
        return data; // /This getMovies function will return data
    } catch(err){}
};

let movies = await getMovies(URL); // So that it will not give us Promise, resolve fully and show the data
// console.log(movies);

// fetch(URL)
//     .then((response) => response.json())
//     .then((data)=> console.log(data))
//     .catch((err)=>console.log(err));

const createElement = ((element) => document.createElement(element));

// Creating Movie Card

const createMovieCard = (movies) => {
    for(let movie of movies){
        // Creating parent div
        const cardContainer = createElement("div");
        cardContainer.classList.add("card", "shadow");

        // Creating img container
        const imageContainer = createElement("div");
        imageContainer.classList.add("card-image-container");

        // Creating card image
        const imageEle = createElement("img");
        imageEle.classList.add("card-image");
        imageEle.setAttribute("src" , movie.img_link);
        imageEle.setAttribute("alt" , movie.name);
        imageContainer.appendChild(imageEle);

        cardContainer.appendChild(imageContainer);

        // Creating card details container

        const cardDetails = createElement("div");
        cardDetails.classList.add("movie-details");

        // card title

        const titleEle = createElement("p");
        titleEle.classList.add("title");
        titleEle.innerText = movie.name;
        cardDetails.appendChild(titleEle);

        // card genre

        const genreEle = createElement("p");
        genreEle.classList.add("genre");
        genreEle.innerText = `Genre: ${movie.genre}`;
        cardDetails.appendChild(genreEle);

        // ratings and length container

        const movieRating = createElement("div");
        movieRating.classList.add("ratings");

        // star/rating component

        const ratings = createElement("div");
        ratings.classList.add("star-rating");

        // star icon

        const starIcon = createElement("span");
        starIcon.classList.add("material-icons-outlined");
        starIcon.innerText = "star";
        ratings.appendChild(starIcon);

        // ratings

        const ratingValue = createElement("span");
        ratingValue.innerText = movie.imdb_rating;
        ratings.appendChild(ratingValue);

        movieRating.appendChild(ratings);

        // length

        const length = createElement("p");
        length.innerText = `${movie.duration} mins`;

        movieRating.appendChild(length);
        cardDetails.appendChild(movieRating);
        cardContainer.appendChild(cardDetails);

        parentElement.appendChild(cardContainer);
    }
};

function getFilteredData(){
    filteredArrOfMovies = 
        searchValue?.length > 0
            ? movies.filter(
                (movie) =>
                    searchValue === movie.name.toLowerCase() ||
                    searchValue === movie.director_name.toLowerCase() ||
                    movie.writter_name.toLowerCase().split(",").includes(searchValue) ||
                    movie.cast_name.toLowerCase().split(",").includes(searchValue)
                )
            : movies;
            if (ratings > 0) {
                filteredArrOfMovies = searchValue?.length > 0 ? filteredArrOfMovies : movies;
                filteredArrOfMovies = filteredArrOfMovies.filter((movie) => movie.imdb_rating >= ratings);
              }
            
            if(genre?.length > 0){
                filteredArrOfMovies = searchValue?.length > 0 || ratings > 7 ? filteredArrOfMovies : movies;
                filteredArrOfMovies = filteredArrOfMovies.filter((movie) =>
                    movie.genre.includes(genre)
                );
            }
    return filteredArrOfMovies;
}

function handleSearch(event){
    searchValue = event.target.value.toLowerCase();
    console.log(searchValue);
    let filterBySearch=getFilteredData();
    parentElement.innerHTML = "";
    createMovieCard(filterBySearch);
    // console.log("filteredData" , filteredArrOfMovies);
}

function debounce(callback, delay) {
    let timerId;
  
    return (...args) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => {
        callback(...args);
      }, delay);
    };
  }

function handleRatingSelector(event){
    ratings=event.target.value;
    // console.log(ratings);
    let filterByRating = getFilteredData();
    parentElement.innerHTML = "";
    createMovieCard(ratings ? filterByRating : movies)
}

const debounceInput = debounce(handleSearch, 500);

searchInput.addEventListener("keyup", debounceInput)

movieRatings.addEventListener("change", handleRatingSelector)

// Filter By Genre

// genre="crime,drama"
// genre="action,crime,drama"

// [[drama,crime],[drama,action,crime],[drama,thriller]]

// const genres = movies.map((movie) => movie.genre)
const genres = movies.reduce((acc,curr) => {
    let genresArr = [];
    let tempGenresArr = curr.genre.split(","); 
    // drama
    // console.log(tempGenresArr);
    acc = [...acc, ...tempGenresArr];
    // console.log(acc);
    for(let genre of acc){
        if(!genresArr.includes(genre)){
            genresArr = [...genresArr, genre]
        }
    }
    return genresArr;
}, [])
// console.log(genres);

for(let genre of genres){
    const option = createElement("option");
    option.classList.add("option");
    option.setAttribute("value", genre);
    option.innerText = genre;
    movieGenres.appendChild(option);
}

function handleGenreSelect(event){
    genre = event.target.value;
    const filteredMoviesByGenre = getFilteredData();
    parentElement.innerHTML="";
    createMovieCard(genre ? filteredMoviesByGenre : movies)
}

movieGenres.addEventListener("change", handleGenreSelect)

createMovieCard(movies);

