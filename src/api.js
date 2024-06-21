const axios = require("axios");
const { getDegreeId } = require("./helper/sqlit_database");

// Define the API function to fetch a random dog image
const getCountries = async () => {
  // URL for the Dog API endpoint to fetch a random dog image
  const url = `https://study-backend.app-seen.com/api/countrys`;

  try {
    // Make a request to the API
    const response = await axios.get(url);

    // Return the image URL from the API response
    return response.data; // 'message' field contains the image URL
  } catch (error) {
    console.error("Error fetching dog image:", error);
    return null;
  }
};
const getSettings = async () => {
  // URL for the Dog API endpoint to fetch a random dog image
  const url = `https://study-backend.app-seen.com/api/settings`;

  try {
    // Make a request to the API
    const response = await axios.get(url);

    // Return the image URL from the API response
    return response.data; // 'message' field contains the image URL
  } catch (error) {
    console.error("Error fetching dog image:", error);
    return null;
  }
};
const degreesByCountry = async (id, pageNumber) => {
  // URL for the Dog API endpoint to fetch a random dog image
  const url = `https://study-backend.app-seen.com/api/degrees?countryId=${id}&pageNumber=${pageNumber ?? 1}`;

  try {
    // Make a request to the API
    const response = await axios.get(url);

    // Return the image URL from the API response
    return response.data; // 'message' field contains the image URL
  } catch (error) {
    console.error("Error fetching dog image:", error);
    return null;
  }
};

const collageByDegree = async (id, page, countryId) => {

  // URL for the Dog API endpoint to fetch a random dog image
  const url = `https://study-backend.app-seen.com/api/fields?degreeId=${id}&pageNumber=${page ?? 1}&countryId=${countryId}`;
  console.log(url);
  try {
    // Make a request to the API
    const response = await axios.get(url);

    // Return the image URL from the API response
    return response.data; // 'message' field contains the image URL
  } catch (error) {
    console.error("Error fetching dog image:", error);
    return null;
  }
};
const unis = async (countryId, fieldId, degreeId) => {
  // URL for the Dog API endpoint to fetch a random dog image
  const url = `https://study-backend.app-seen.com/api/degreefields?fieldId=${fieldId}&countryId=${countryId}&degreeId=${degreeId}`;
  console.log(url);
  try {
    // Make a request to the API
    const response = await axios.get(url);

    // Return the image URL from the API response
    return response.data; // 'message' field contains the image URL
  } catch (error) {
    console.error("Error fetching dog image:", error);
    return null;
  }
};

const asks = async (countryId) => {
  // URL for the Dog API endpoint to fetch a random dog image
  const url = `https://study-backend.app-seen.com/api/questions?countryId=${countryId}`;

  try {
    // Make a request to the API
    const response = await axios.get(url);
    console.log(response.data);
    // Return the image URL from the API response
    return response.data; // 'message' field contains the image URL
  } catch (error) {
    console.error("Error fetching dog image:", error);
    return null;
  }
};

const getCountryById = async (countryId) => {
  const url = `https://study-backend.app-seen.com/api/countrys/${countryId}`;

  try {
    // Make a request to the API
    const response = await axios.get(url);
    console.log(response.data);
    // Return the image URL from the API response
    return response.data; // 'message' field contains the image URL
  } catch (error) {
    console.error("Error fetching dog image:", error);
    return null;
  }
}
module.exports = {
  degreesByCountry,
  collageByDegree,
  getCountries,
  getSettings,
  unis,
  asks,
  getCountryById
};
