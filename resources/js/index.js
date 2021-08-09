const addMovieModal = document.getElementById("addModal");
const headerAddMovieButton = document.querySelector("header a");
const backDrop = document.getElementById("backDrop");
const entryTextSection = document.querySelector(".entryText");
const addMovieButton = addMovieModal.querySelector("#model1Add");
const cancelAddMovieButton = addMovieModal.querySelector("#model1Cancel");
const modalInputs = addMovieModal.querySelectorAll("input");
const listBox = document.getElementById("movieList");
const deleteMovieModal = document.getElementById("deleteMovieModal");

const moviesList = [];

const backdropHandler = () => {
    backDrop.classList.toggle("visible");
};
const openAddMovieModal = () => {
    backdropHandler();
    addMovieModal.classList.add("visible");
};
const closeAddMovieModal = () => {
    backdropHandler();
    addMovieModal.classList.remove("visible");
};
const openDeleteMovieModal = () => {
    backdropHandler();
    deleteMovieModal.classList.add("visible");
};
const closeDeleteMovieModal = () => {
    backdropHandler();
    deleteMovieModal.classList.remove("visible");
};

const updateUI = () => {
    if (moviesList.length === 0) {
        entryTextSection.style.display = "block";
    } else {
        entryTextSection.style.display = "none";
    }
};

const clearInputHandler = () => {
    for (const input of modalInputs) {
        input.value = "";
    }
};
const backdropClickHandler = () => {
    clearInputHandler();
    if (deleteMovieModal.classList.contains("visible")) {
        closeDeleteMovieModal();
    } else if (addMovieModal.classList.contains("visible")) {
        closeAddMovieModal();
    }
};

const deleteMovie = (movieId) => {
    let movieIndex = 0;
    for (const movie of moviesList) {
        if (movie.id === movieId) {
            break;
        }
        movieIndex++;
    }
    moviesList.splice(movieIndex, 1);
    const listContainer = document.getElementById("movieList");
    listContainer.children[movieIndex].remove();
    closeDeleteMovieModal();
    updateUI();
};

const deleteMovieHandler = (movieId) => {
    openDeleteMovieModal();
    const undoDeleteButton = deleteMovieModal.querySelector(".btnPassive");
    let deleteButton = deleteMovieModal.querySelector(".btnSuccess");

    //Clearing previous event listeners
    deleteButton.replaceWith(deleteButton.cloneNode(true));
    deleteButton = deleteMovieModal.querySelector(".btnSuccess");
    undoDeleteButton.removeEventListener("click", closeDeleteMovieModal);

    deleteButton.addEventListener("click", deleteMovie.bind(null, movieId));
    undoDeleteButton.addEventListener("click", closeDeleteMovieModal);
};

const modalInputHandler = () => {
    const title = modalInputs[0].value;
    const imgURL = modalInputs[1].value;
    const movieRating = modalInputs[2].value;

    const isValidURL = fetch(imgURL)
        .then((res) => {
            if (res.status === 200) {
                if (
                    title.trim() === "" ||
                    movieRating.trim() === "" ||
                    movieRating > 5 ||
                    movieRating < 1
                ) {
                    alert("Fields can not be blank (rating 1-5)");
                } else if (!isValidURL) {
                    alert("Enter a valid image url!");
                } else {
                    const newMovie = {
                        id: Math.random().toString(),
                        title,
                        imgURL,
                        rating: movieRating,
                    };

                    moviesList.push(newMovie);
                    updateUI();
                    clearInputHandler();
                    closeAddMovieModal();
                    renderNewElement(
                        newMovie.id,
                        newMovie.title,
                        newMovie.imgURL,
                        newMovie.rating
                    );
                }
            } else {
                alert("Entered url is not valid!");
            }
        })
        .catch((err) => {
            return false;
        });
};

const renderNewElement = (id, title, imgURL, rating) => {
    const newMovieElement = document.createElement("li");
    newMovieElement.className = "movieElement";
    newMovieElement.id = id;
    newMovieElement.innerHTML = `
        <figure class="card_Horizontal">
        <div class="card_ImageBox">
            <img class="card_Image" src="${imgURL}" alt="${title}" />
        </div>
        <div class="card_Content">
            <div class="ratingBox">
                <div>
                    <h1>${title}</h1>
                    <div class="starContainer">
                        <div>
                            <i class="fa fa-star-o starIcon" aria-hidden="true"></i>
                        </div>
                        <div>
                            <i class="fa fa-star-o starIcon" aria-hidden="true"></i>
                        </div>
                        <div>
                            <i class="fa fa-star-o starIcon" aria-hidden="true"></i>
                        </div>
                        <div>
                            <i class="fa fa-star-o starIcon" aria-hidden="true"></i>
                        </div>
                        <div>
                            <i class="fa fa-star-o starIcon" aria-hidden="true"></i>
                        </div>
                    </div>

                    <p>${rating} average based on 254 reviews.</p>
                </div>
            </div>
        </div>
    </figure>`;

    newMovieElement.addEventListener("click", deleteMovieHandler.bind(null, id));

    listBox.appendChild(newMovieElement);
};

headerAddMovieButton.addEventListener("click", openAddMovieModal);
backDrop.addEventListener("click", backdropClickHandler);
cancelAddMovieButton.addEventListener("click", closeAddMovieModal);
addMovieButton.addEventListener("click", modalInputHandler);