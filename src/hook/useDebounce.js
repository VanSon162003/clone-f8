import React, { useEffect, useState } from "react";

function useDebounce(value, delay) {
    const [input, setInput] = useState(value);

    useEffect(() => {
        const timeId = setTimeout(() => {
            setInput(value);
        }, delay);

        return () => clearTimeout(timeId);
    }, [value, delay]);

    return input;
}

export default useDebounce;
