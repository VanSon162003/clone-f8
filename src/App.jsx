import { BrowserRouter as Router } from "react-router-dom";

import ScrollTop from "./components/ScrollTop";
import AppRoutes from "./components/AppRoutes";
import UserProvider from "./components/UserProvider";

function App() {
    return (
        <Router>
            <UserProvider />

            <ScrollTop />
            <AppRoutes />
        </Router>
    );
}

export default App;
