import { Route, Routes } from "react-router-dom";

import DefaultLayout from "@/layouts/DefaultLayout";
import NoLayout from "@/layouts/NoLayout";
import routes from "@/route/index.jsx";
import ProtectedRoute from "../ProtectedRoute";
import ProtectedAdminRoute from "../ProtectedAdminRoute";
import { Fragment } from "react";

function AppRoutes() {
    return (
        <Routes>
            {routes.map((route) => {
                const Layout =
                    route.layout === undefined
                        ? DefaultLayout
                        : route.layout || NoLayout;

                const Component = route.component;

                let RouteElement = Fragment;
                if (route.protected) {
                    RouteElement = ProtectedRoute;
                } else if (route.auth) {
                    RouteElement = ProtectedAdminRoute;
                }
                return (
                    <Route key={route.path} element={<Layout />}>
                        <Route
                            path={route.path}
                            element={
                                <RouteElement>
                                    <Component />
                                </RouteElement>
                            }
                        />
                    </Route>
                );
            })}
        </Routes>
    );
}

export default AppRoutes;
