import { BrowserRouter as Router } from "react-router-dom";

import ScrollTop from "./components/ScrollTop";
import AppRoutes from "./components/AppRoutes";
import UserProvider from "./components/UserProvider";
import ResetHeaderBack from "./components/ResetHeaderBack";

function App() {
    return (
        <Router>
            <UserProvider />
            <ResetHeaderBack />

            <ScrollTop />
            <AppRoutes />
        </Router>
    );
}

export default App;
