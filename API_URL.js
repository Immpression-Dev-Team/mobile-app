const PROD_URL = "https://immpression-backend.vercel.app"
const ENV = process.env.VITE_APP_ENV;
const API_URL =
    ENV === "prod"
        ? PROD_URL
        : `http://localhost:${process.env.BACKEND_PORT || "4000"}`;

console.log("API URL:", API_URL);

export { API_URL };
