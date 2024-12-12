// config.js

export const API_URL = "https://immpression-backend.vercel.app";

// export const API_URL = `http://192.168.8.121:4000`;
//export const API_URL = `http://10.55.16.90:4000`;

// To test the app locally, follow these steps:

//     Backend Connection:
//         Connect your mobile app to the backend using your local network IP address.

//     Update API_URL:
//         In config.js, replace the placeholder with your local IP:

//     ```

// export const API_URL = `http://<your-ip-address>:4000`;

//     ```

// You can get your IP from the log after running npx expo start, just below the QR code:

//     ```

//     Metro waiting on exp://192.168.8.121:8081

//     ```

//     Copy the part between the second slash and the last colon, e.g., 192.168.8.121.

// Why IP, Not localhost?:

//     localhost points to the device/emulator, not your PC. Use your local IP to connect over the network to your PC's backend.

// Ensure:

//     Both your mobile device/emulator and PC are on the same network.
//     The backend is running on port 4000.
//     No firewall is blocking connections.
