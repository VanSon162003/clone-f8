import { createContext, useState } from "react";

export const LoadingContext = createContext();

function LoadingProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const values = {
        isLoading,
        setIsLoading,
    };

    return (
        <LoadingContext.Provider value={values}>
            {children}
        </LoadingContext.Provider>
    );
}

export default LoadingProvider;
