import React from "react";
import ReactDOM from "react-dom";
import "../styles/index.css";
import MainPage from "./pages/MainPage";
import { AuthContextProvider } from "./contexts/AuthContext";

ReactDOM.render(
   <React.StrictMode>
      <AuthContextProvider>
         <MainPage />
      </AuthContextProvider>
   </React.StrictMode>,
   document.getElementById("root")
);
