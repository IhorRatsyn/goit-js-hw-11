import axios from "axios";
import SimpleLightbox from "simplelightbox";

const apiKey = "41180960-205db463c927a63d3b7755308"; // Замініть на свій ключ Pixabay API
const perPage = 20;

axios.defaults.baseURL = "https://pixabay.com/api/";
axios.defaults.params = {
  key: apiKey,
  image_type: "photo",
  orientation: "horizontal",
  safesearch: true,
};

export async function searchImages(query, page) {
  try {
    const response = await axios.get("", { params: { q: query, page, per_page: perPage } });
    return response.data;
  } catch (error) {
    throw error;
  }
}
