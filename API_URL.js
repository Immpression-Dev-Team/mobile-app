// Change between production and development backend services
// "dev" for local OR "prod" for remote
const ENV = "prod";


// TODO: REPLACE WITH *YOUR* HOST IP "192.1.x.x" for most local networks. You must also add your ip in the root .env file
// Linux run - ip addr
// Windows run - ipconfig
// Mac run - ifconfig | grep "inet "
const HOST_IP = "192.168.1.6";

const PROD_URL = "https://immpression-backend.vercel.app"
const API_URL =
    ENV === "prod"
        ? PROD_URL
        : `http://${HOST_IP}:4000`;

console.log("API URL:", API_URL);

export { API_URL, HOST_IP };
