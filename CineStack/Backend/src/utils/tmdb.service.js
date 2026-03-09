const axios = require("axios");

/**
 * TMDB Service
 * Responsible for all outgoing requests to the TMDB API.
 * Centralizes authentication and base URL configuration.
 */
const fetchFromTMDB = async (endpoint) => {
  const options = {
    method: "GET",
    url: `${process.env.TMDB_BASE_URL}/${endpoint}`,
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`, // Using Access Token as it's more secure/modern
    },
  };

  try {
    const response = await axios.request(options);

    if (response.status !== 200) {
      throw new Error(`TMDB API error: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching data from TMDB:", error.message);
    throw new Error(
      "Failed to fetch data from TMDB API. Please try again later.",
    );
  }
};

module.exports = {
  fetchFromTMDB,
};
