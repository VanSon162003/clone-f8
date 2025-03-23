import React from "react";
import Header from "../DefaultLayout/components/Header";
import { Outlet } from "react-router-dom";

function NoFooterLayout() {
    return (
        <>
            <div>NoFooterLayout</div>
            <Header />

            <Outlet />
        </>
    );
}

export default NoFooterLayout;
