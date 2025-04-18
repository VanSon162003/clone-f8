import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./scss/reset.scss";
import "./scss/grid.scss";
import "./scss/base.scss";
import LoadingProvider from "./contexts/LoadingContext/index.jsx";
import store from "./store/index.js";
import { Provider as ReduxProvider } from "react-redux";

createRoot(document.getElementById("root")).render(
    <ReduxProvider store={store}>
        <LoadingProvider>
            <App />
        </LoadingProvider>
    </ReduxProvider>
);
