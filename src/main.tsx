import { createRoot } from "react-dom/client";
import { GoogleOAuthProvider } from '@react-oauth/google';
import App from "./App.tsx";
import "./index.css";

// You'll need to replace this with your actual Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = "60515087583-nljvu9tqfcaernj6hanqg77c4jropcqb.apps.googleusercontent.com";

createRoot(document.getElementById("root")!).render(
  <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
    <App />
  </GoogleOAuthProvider>
);
