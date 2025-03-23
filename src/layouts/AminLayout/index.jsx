import React from "react";
import Header from "../DefaultLayout/components/Header";
import { Outlet } from "react-router-dom";
import Footer from "../DefaultLayout/components/Footer";

function AdminLayout() {
    return (
        <>
            <Header />
            <main>
                <div>admin layout</div>
                <Outlet />
            </main>

            <Footer />
        </>
    );
}

export default AdminLayout;
