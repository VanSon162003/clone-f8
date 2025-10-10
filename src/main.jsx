import { createRoot } from "react-dom/client";

import { Provider as ReduxProvider } from "react-redux";
import { persistor, store } from "./store/index.js";
import { PersistGate } from "redux-persist/integration/react";
import { Auth0Provider } from "@auth0/auth0-react";

import "./scss/reset.scss";
import "./scss/grid.scss";
import "./scss/base.scss";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
    <ReduxProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <Auth0Provider
                domain={import.meta.env.VITE_AUTH0_DOMAIN}
                clientId={import.meta.env.VITE_AUTH0_CLIENT_ID}
                authorizationParams={{
                    redirect_uri: window.location.origin,
                    audience: import.meta.env.VITE_AUTH0_AUDIENCE,
                    scope: "openid profile email",
                }}
            >
                <App />
            </Auth0Provider>
        </PersistGate>
    </ReduxProvider>
);
