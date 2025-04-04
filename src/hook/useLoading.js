import { LoadingContext } from "@/contexts/LoadingContext";
import React, { useContext } from "react";

function useLoading() {
    const { isLoading, setIsLoading } = useContext(LoadingContext);

    return { isLoading, setIsLoading };
}

export default useLoading;
