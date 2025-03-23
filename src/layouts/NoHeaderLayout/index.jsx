import React from "react";
import Footer from "../DefaultLayout/components/Footer";
import { Outlet } from "react-router-dom";

function NoHeaderLayout() {
    return (
        <>
            <div>NoHeaderLayout</div>
            <Outlet />
            <Footer />
        </>
    );
}

export default NoHeaderLayout;
