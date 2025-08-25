import { HOST_IP } from "@env";

// Change between production and development backend services
// "dev" for local OR "prod" for remote
const ENV = "dev";

// TODO: ADD HOST_IP to .env file at project root (e.g., 192.168.10.5)
const IP = HOST_IP;

const PROD_URL = "https://immpression-backend.vercel.app";

// Ensure dev URL includes the http scheme
const DEV_URL = IP
  ? IP.startsWith("http")
    ? `${IP}:5001`
    : `http://${IP}:5001`
  : undefined;

const API_URL = ENV === "prod" ? PROD_URL : DEV_URL;

console.log("API URL:", API_URL);

export { API_URL, IP };
