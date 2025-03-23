import React from "react";
import { Outlet } from "react-router-dom";

function NoLayout() {
    return (
        <div>
            NoLayout
            <Outlet />
        </div>
    );
}

export default NoLayout;
