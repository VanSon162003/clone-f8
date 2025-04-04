import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./scss/reset.scss";
import "./scss/grid.scss";
import "./scss/base.scss";
import UserProvider from "./contexts/UserContext/index.jsx";
import LoadingProvider from "./contexts/LoadingContext/index.jsx";

createRoot(document.getElementById("root")).render(
    <UserProvider>
        <LoadingProvider>
            <App />
        </LoadingProvider>
    </UserProvider>
);
