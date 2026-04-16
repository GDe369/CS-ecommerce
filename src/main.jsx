import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
// 1. Import Provider
import { GoogleOAuthProvider } from "@react-oauth/google";

const googleClientId =
  import.meta.env.VITE_GOOGLE_CLIENT_ID ||
  "611957118819-55og6lerregp08ug82om6950k3280s5t.apps.googleusercontent.com";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    {/* 2. Bọc Provider ngoài cùng hoặc trong AuthProvider */}
    <GoogleOAuthProvider clientId={googleClientId}>
      <AuthProvider>
        <CartProvider>
          <App />
        </CartProvider>
      </AuthProvider>
    </GoogleOAuthProvider>
  </StrictMode>,
);
