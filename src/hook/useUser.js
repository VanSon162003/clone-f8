import React from "react";

import { useContext } from "react";
import { UserContext } from "@/contexts/UserContext";
function useUser() {
    const userContext = useContext(UserContext);
    return userContext.user;
}

export default useUser;
