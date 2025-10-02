import { BrowserRouter as Router } from "react-router-dom";

import ScrollTop from "./components/ScrollTop";
import AppRoutes from "./components/AppRoutes";
import UserProvider from "./components/UserProvider";
import ResetHeaderBack from "./components/ResetHeaderBack";
import { ToastContainer } from "react-toastify";
function App() {
    return (
        <Router>
            <UserProvider />
            <ResetHeaderBack />

            <ScrollTop />
            <AppRoutes />

            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="light"
            />
        </Router>
    );
}

export default App;
