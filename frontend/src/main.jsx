import { StrictMode } from 'react'
import './normalize.css'
import './index.css'
import App from './App.jsx'
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
);
