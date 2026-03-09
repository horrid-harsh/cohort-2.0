const axios = require("axios");

/**
 * TMDB Service
 * Responsible for all outgoing requests to the TMDB API.
 * Centralizes authentication and base URL configuration.
 */
const fetchFromTMDB = async (endpoint, params = {}) => {
  const options = {
    method: "GET",
    url: `${process.env.TMDB_BASE_URL}/${endpoint}`,
    params, // Support for page, query, etc.
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`, // Using Access Token
    },
  };

  try {
    const response = await axios.request(options);

    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.status_message || error.message;
    console.error("Error fetching data from TMDB:", errorMessage);
    throw new Error(
      `TMDB Error: ${errorMessage || "Failed to fetch data from TMDB API."}`,
    );
  }
};

module.exports = {
  fetchFromTMDB,
};
