import axios from "axios";
import SimpleLightbox from "simplelightbox";

const apiKey = "YOUR_PIXABAY_API_KEY"; // Replace with your Pixabay API key
const perPage = 20;

axios.defaults.baseURL = "https://pixabay.com/api/";
axios.defaults.params = {
  key: apiKey,
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
};

const searchForm = document.getElementById("search-form");
const gallery = document.getElementById("gallery");
const loadMoreBtn = document.getElementById("load-more");
const lightbox = new SimpleLightbox();

let currentPage = 1;
let currentQuery = "";

searchForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const searchQuery = event.target.elements.searchQuery.value.trim();

  if (searchQuery === "") {
    return;
  }

  if (searchQuery !== currentQuery) {
    clearGallery();
    currentPage = 1;
  }

  currentQuery = searchQuery;
  searchImages(searchQuery, currentPage);
});

loadMoreBtn.addEventListener("click", function () {
  currentPage++;
  searchImages(currentQuery, currentPage);
});

function searchImages(query, page) {
  axios
    .get("", { params: { q: query, page, per_page: perPage } })
    .then(handleSuccess)
    .catch(handleError);
}

function handleSuccess(response) {
  const images = response.data.hits;

  if (images.length === 0) {
    Notiflix.Notify.failure("Sorry, there are no images matching your search query. Please try again.");
    return;
  }

  const totalHits = response.data.totalHits;
  Notiflix.Notify.success(`Hooray! We found ${totalHits} images.`);

  renderImages(images);

  if (images.length < perPage) {
    loadMoreBtn.style.display = "none";
    Notiflix.Notify.info("We're sorry, but you've reached the end of search results.");
  } else {
    loadMoreBtn.style.display = "block";
  }

  lightbox.refresh();
  scrollToGallery();
}

function renderImages(images) {
  images.forEach((image) => {
    const card = createPhotoCard(image);
    gallery.appendChild(card);
  });
}

function createPhotoCard(image) {
  const card = document.createElement("div");
  card.classList.add("photo-card");

  const img = document.createElement("img");
  img.src = image.webformatURL;
  img.alt = image.tags;
  img.loading = "lazy";

  const info = document.createElement("div");
  info.classList.add("info");
  info.innerHTML = `
    <p class="info-item"><b>Likes:</b> ${image.likes}</p>
    <p class="info-item"><b>Views:</b> ${image.views}</p>
    <p class="info-item"><b>Comments:</b> ${image.comments}</p>
    <p class="info-item"><b>Downloads:</b> ${image.downloads}</p>
  `;

  card.appendChild(img);
  card.appendChild(info);

  return card;
}

function handleError(error) {
  Notiflix.Notify.failure("An error occurred while fetching images. Please try again.");
  console.error("Error:", error);
}

function clearGallery() {
  gallery.innerHTML = "";
  loadMoreBtn.style.display = "none";
}

function scrollToGallery() {
  const { height: cardHeight } = gallery.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: "smooth",
  });
}
