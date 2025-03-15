import dotenv from "dotenv"

// Change between production and development backend services
// "dev" for local OR "prod" for remote
const ENV = "prod";

dotenv.config();

// TODO: ADD IP TO .env file located in mobile-app folder
const HOST_IP = process.env.HOST_IP;

const PROD_URL = "https://immpression-backend.vercel.app"
const API_URL =
    ENV === "prod"
        ? PROD_URL
        : `http://${HOST_IP}:4000`;

console.log("API URL:", API_URL);

export { API_URL, HOST_IP };
