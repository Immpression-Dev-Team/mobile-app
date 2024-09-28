import axios from "axios";
import { API_URL } from "../config";
//These request will be split off to separate api files

async function getAllImages(token) {
  try {
    const response = await axios.get(`${API_URL}/all_images`, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Add token to headers
      }
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching images:", error);
    return error;
  }
}

async function uploadImage(data, token) {
  try {
    const response = await axios.post(`${API_URL}/image`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Add token to headers
        'Content-Type': 'application/json',  // Ensure the content type is set correctly
      }
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return error;
  }
}

async function uploadProfilePicture(data, token) {
  try {
    const response = await axios.post(`${API_URL}/profile-picture`, data, {
      headers: {
        'Authorization': `Bearer ${token}`,  // Add token to headers
        'Content-Type': 'application/json',  // Ensure the content type is set correctly
      }
    });
    return response.data;
  } catch (error) {
    console.log(error)
    return error;
  }
}

export const fetchProfilePicture = async (userId) => {
  try {
    const response = await fetch(`${API_URL}/profile-picture/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching profile picture:", error);
    throw error;
  }
};



export {
  getAllImages,
  uploadImage,
  uploadProfilePicture,
}