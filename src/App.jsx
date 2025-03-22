import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import DefaultLayout from "./layouts/DefaultLayout";
import ScrollTop from "./components/ScrollTop";
import routes from "./route";

function App() {
    return (
        <Router>
            <ScrollTop />

            <Routes>
                <Route element={<DefaultLayout />}>
                    {routes.map((route) => {
                        const Component = route.component;
                        return (
                            <Route
                                key={route.path}
                                path={route.path}
                                element={<Component />}
                            />
                        );
                    })}
                </Route>
            </Routes>
        </Router>
    );
}

export default App;
