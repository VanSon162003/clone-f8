import { createRoot } from "react-dom/client";

import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./store/index.js";
import { PersistGate } from "redux-persist/integration/react";

import "./scss/reset.scss";
import "./scss/grid.scss";
import "./scss/base.scss";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <App />
        </PersistGate>
    </ReduxProvider>
);
