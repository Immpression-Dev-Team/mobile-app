import axios from 'axios';
import { API_URL } from '../API_URL';

async function requestOtp(email, password) {
  try {
    const response = await axios.post(
      `${API_URL}/request-otp`,
      { email, password },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      'Error requesting OTP',
      error?.response || error?.message || error
    );
    return error;
  }
}

async function verifyOtp(email, code) {
  try {
    const response = await axios.post(
      `${API_URL}/verify-otp`,
      {
        email,
        otp: code,
      },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      'Error verifying code',
      error?.response || error?.message || error
    );
    return error;
  }
}

// Function to update the user's bio
async function updateBio(bio, token) {
  // Removed userId parameter from the function

  try {
    console.log('Sending data to server:', { bio }); // Log the data being sent to the server
    const response = await axios.put(
      `${API_URL}/set-bio`, // Removed userId from the payload
      { bio },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
          'Content-Type': 'application/json', // Ensure the content type is set correctly
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error updating bio:', error);
    console.error('Server response:', error.response?.data); // Log server response for more details
    return error;
  }
}

// Function to get the user's bio
async function getBio(token) {
  try {
    const response = await axios.get(`${API_URL}/get-bio`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers for authentication
        'Content-Type': 'application/json', // Ensure the content type is set correctly
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching bio:', error);
    console.error('Server response:', error.response?.data); // Log server response for more details
    return error;
  }
}

// Function to update the user's artist type
async function updateArtistType(artistType, token) {
  // Removed userId parameter
  try {
    console.log('Sending data to server:', { artistType }); // Log the data being sent to the server
    const response = await axios.put(
      `${API_URL}/set-artist-type`, // Removed userId from the payload
      { artistType },
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers
          'Content-Type': 'application/json', // Ensure the content type is set correctly
        },
      }
    );

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error updating artist type:', error);
    return error.response?.data || error;
  }
}

// Function to update the user's art types (art-lover)
async function updateArtType(artTypes, token) {
  try {
    const response = await axios.put(
      `${API_URL}/set-art-categories`,
      artTypes,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    console.log(response);
    return response.data;
  } catch (error) {
    console.error('Error updating art-lover art types: ', error);
    return error.response?.data || error;
  }
}

// Function to get the user's artist type
async function getArtistType(token) {
  try {
    const response = await axios.get(`${API_URL}/get-artist-type`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers for authentication
        'Content-Type': 'application/json', // Ensure the content type is set correctly
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching artist type:', error);
    console.error('Server response:', error.response?.data); // Log server response for more details
    return error;
  }
}

// Existing API functions
async function getAllImages(token, page = 1, limit = 25, category = null) {
  try {
    // set up header w/ token & optional param in request
    const params = {
      page,
      limit,
      ...(category && { category: category.toLowerCase() }),
    };
    const response = await axios.get(`${API_URL}/all_images`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params,
    });

    return response.data;
  } catch (error) {
    // console.error('Error fetching images:', error.response);
    return error.response;
  }
}

async function uploadImage(data, token) {
  try {
    const response = await axios.post(`${API_URL}/image`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
        'Content-Type': 'application/json', // Ensure the content type is set correctly
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error.response;
  }
}

async function uploadProfilePicture(data, token) {
  try {
    const response = await axios.post(`${API_URL}/profile-picture`, data, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
        'Content-Type': 'application/json', // Ensure the content type is set correctly
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    return error;
  }
}

const fetchProfilePicture = async (userId) => {
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
    console.error('Error fetching profile picture:', error);
    throw error;
  }
};

const updateProfilePicture = async (imageData, token) => {
  try {
    const response = await fetch(`${API_URL}/profile-picture`, {
      method: 'PUT', // Use PUT method to update
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Assuming you use a token for authentication
      },
      body: JSON.stringify(imageData),
    });

    if (!response.ok) {
      throw new Error('Failed to update profile picture');
    }

    return await response.json();
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

const deleteProfilePicture = async (publicId) => {
  try {
    const response = await fetch(`${API_URL}/delete-profile-picture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ public_id: publicId }),
    });

    const result = await response.json();
    console.log('Delete result:', result);

    // Check if the backend returned a success message or that the file was not found
    if (result.success || result.message === 'File not found') {
      return {
        success: true,
        message: result.message || 'Profile picture deleted successfully',
      };
    } else {
      console.warn('No existing profile picture found.');
      return {
        success: true,
        message: 'No profile picture found for deletion',
      };
    }
  } catch (error) {
    console.error('Error deleting image:', error);
    return { success: false, error: 'Failed to delete image' };
  }
};

async function getAllProfilePictures(token) {
  try {
    const response = await axios.get(`${API_URL}/all-profile-pictures`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
      },
    });

    return response.data.users; // Adjusted to return the full user data including bio and artistType
  } catch (error) {
    console.error('Error fetching profile pictures:', error);
    return error;
  }
}

const getUserProfile = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/get-profile`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token if authentication is needed
      },
    });
    return response.data; // Return the user profile data
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

async function getUserImages(token) {
  try {
    const response = await axios.get(`${API_URL}/images`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user's images:", error);
    return error;
  }
}

// Function to increment views for a specific user by ID
async function incrementViews(userId, token) {
  try {
    const response = await axios.patch(
      `${API_URL}/increment-views/${userId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers for authentication
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error incrementing views:', error);
    return error.response;
  }
}

// Function to update accountType for a specific user by ID
async function updateAccountType(accountType, token) {
  try {
    const response = await axios.post(
      `${API_URL}/accountType`,
      {
        accountType,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating account type:', error);
    return error.response?.data || error;
  }
}

// Function to increment views for a specific image by ID
async function incrementImageViews(imageId, token) {
  try {
    const response = await axios.patch(
      `${API_URL}/increment-image-views/${imageId}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token to headers for authentication
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error incrementing image views:', error);
    return error.response;
  }
}

// Function to get the view count for a specific image by ID
async function getImageViews(imageId, token) {
  try {
    const response = await axios.get(`${API_URL}/get-image-views/${imageId}`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers for authentication
        'Content-Type': 'application/json',
      },
    });
    return response.data; // Return the image views data
  } catch (error) {
    console.error('Error fetching image views:', error);
    return error.response;
  }
}
async function createOrder(orderData, token) {
  try {
    const response = await axios.post(`${API_URL}/order`, orderData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers
        'Content-Type': 'application/json', // Ensure the content type is set correctly
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating order:', error.response?.data || error);
    throw error;
  }
}

async function createPaymentIntent(paymentData, token) {
  try {
    const response = await axios.post(
      `${API_URL}/create-payment-intent`,
      paymentData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // Contains the client_secret and other payment details
  } catch (error) {
    console.error(
      'Error creating payment intent:',
      error.response?.data || error
    );
    throw error;
  }
}

async function confirmPayment(paymentIntentId, token) {
  try {
    const response = await axios.post(
      `${API_URL}/confirm-payment`,
      { paymentIntentId },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data; // Contains confirmation result
  } catch (error) {
    console.error('Error confirming payment:', error.response?.data || error);
    throw error;
  }
}
async function getPaymentStatus(paymentIntentId, token) {
  try {
    const response = await axios.get(
      `${API_URL}/payment-status/${paymentIntentId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data; // Contains the PaymentIntent status
  } catch (error) {
    console.error(
      'Error fetching payment status:',
      error.response?.data || error
    );
    throw error;
  }
}

// Function to delete a user's account
async function deleteAccount(token) {
  try {
    const response = await axios.delete(`${API_URL}/delete-account`, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token to headers for authentication
      },
    });
    return response.data; // Return the response from the server
  } catch (error) {
    console.error('Error deleting account:', error.response?.data || error);
    return error.response?.data || error;
  }
}

// Function to update user profile fields (name, email, password)
async function updateUserProfile(updatedData, token) {
  try {
    const response = await axios.put(`${API_URL}/update-profile`, updatedData, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token for authentication
        'Content-Type': 'application/json',
      },
    });

    return response.data; // Return success message and updated user info
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error);
    return error.response?.data || error;
  }
}

// Function to fetch the current bid for an image
async function getCurrentBid(imageId, token) {
  try {
    const response = await axios.get(`${API_URL}/current-bid/${imageId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching current bid:', error);
    return error.response?.data || error;
  }
}

// Function to place a bid on an image
async function placeBid(imageId, bidAmount, token) {
  try {
    const response = await axios.post(
      `${API_URL}/place-bid/${imageId}`,
      { bidAmount },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error placing bid:', error);
    return error.response?.data || error;
  }
}

// Function to fetch likes data
async function fetchLikeData(imageId, token) {
  try {
    const response = await axios.get(`${API_URL}/image/${imageId}/likes`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching like data:', error);
    return { likesCount: 0, hasLiked: false };
  }
}

// Function to toggle like/unlike
async function toggleLike(imageId, token) {
  try {
    const response = await axios.post(
      `${API_URL}/image/${imageId}/like`,
      {},
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error('Error liking/unliking image:', error);
    return { likesCount: 0, hasLiked: false };
  }
}

// Function to update image stage (for approving/rejecting images)
async function updateImageStage(imageId, stage, token) {
  try {
    const response = await axios.patch(
      `${API_URL}/image/${imageId}/review`,
      { stage },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error('Error updating image stage:', error);
    return error.response?.data || error;
  }
}

async function fetchUserProfilePicture(userId, token) {
  console.log(`Fetching profile picture for userId: ${userId}`);
  try {
    const response = await axios.get(`${API_URL}/profile-picture/${userId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Profile picture response:', response.data);

    return response.data.profilePictureLink || null;
  } catch (error) {
    console.error(
      'Error fetching user profile picture:',
      error.response?.data || error
    );
    return null; // Return null if there's an error
  }
}

async function fetchLikedImages(token) {
  try {
    const response = await axios.get(`${API_URL}/image/liked-images`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    return {
      success: response.data.success,
      images: response.data.images || [],
    };
  } catch (err) {
    console.error('Error fetching liked images:', err.response?.data || err);
    return { success: false, images: [] };
  }
}


export {
  requestOtp,
  verifyOtp,
  getAllImages,
  uploadImage,
  uploadProfilePicture,
  fetchProfilePicture,
  updateProfilePicture,
  deleteProfilePicture,
  getAllProfilePictures,
  updateBio,
  updateArtistType,
  updateArtType,
  getBio,
  getArtistType,
  getUserProfile,
  getUserImages,
  incrementViews,
  updateAccountType,
  incrementImageViews,
  getImageViews,
  createOrder,
  createPaymentIntent,
  confirmPayment,
  getPaymentStatus,
  deleteAccount,
  updateUserProfile,
  getCurrentBid,
  placeBid,
  fetchLikeData,
  toggleLike,
  updateImageStage,
  fetchUserProfilePicture,
  fetchLikedImages,
};
