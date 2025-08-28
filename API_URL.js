import { HOST_IP } from "@env";

// Change between production and development backend services
// "dev" for local OR "prod" for remote
const ENV = "local";

// TODO: ADD IP TO .env file located in mobile-app folder
const IP = process.env.HOST_IP;

const PROD_URL = "https://immpression-backend.vercel.app";
const API_URL = ENV === "prod" ? PROD_URL : `${HOST_IP}:5003`;

console.log("API URL:", API_URL);

export { API_URL, IP };
