import { HOST_IP } from "@env";

// change to false for local api
const FORCE_PROD = true;

const API_URL = !__DEV__ || FORCE_PROD
    ? "https://immpression-backend.vercel.app"
    : `http://${HOST_IP}:4000`;

console.log("API URL:", API_URL);

export { API_URL };

console.log(API_URL);
