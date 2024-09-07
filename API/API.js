import axios from "axios";
import { API_URL } from "../config";
//These request will be split off to separate api files

async function getAllImages() {
    try {
        const response = await axios.get(`${API_URL}/all_images`)
        return response.data;
    } catch (error) {
        return error;
    }
}

async function uploadImage(data) {
    try {
        const response = await axios.post(`${API_URL}/image`, data)
        return response.data;
    } catch (error) {
        return error;
    }
}

export {
    getAllImages,
    uploadImage,
}