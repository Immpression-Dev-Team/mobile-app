// config.js
const DEV_IP = '192.168.1.246';
const DEV_PORT = 4000;

const isProduction = process.env.NODE_ENV === 'production';

export const API_URL = isProduction 
  ? "https://immpression-backend.vercel.app"
  : `http://${DEV_IP}:${DEV_PORT}`;

export const GOOGLE_CONFIG = {
    expoClientId: '709309106647-pb9k612u1pe4olikmvfaaktkauj3bjts.apps.googleusercontent.com',
    iosClientId: '709309106647-rqnlk0i13qkb6qc901aoj3tapaskuu8t.apps.googleusercontent.com',
    androidClientId: '709309106647-rfamr61c8baek898du9jlqf0ccfoof85.apps.googleusercontent.com',
    webClientId: '709309106647-pb9k612u1pe4olikmvfaaktkauj3bjts.apps.googleusercontent.com',
  };

  export const AUTH_CONFIG = {
    // The redirect URL should match what's configured in your Google Cloud Console
    redirectUri: 'https://auth.expo.io/@alexis2995/immpression',
    // Add any additional auth-related configuration here
  };

// export const API_URL = `http://192.168.1.232:5000`;
// export const API_URL = `http://10.55.16.79:5000`;

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
