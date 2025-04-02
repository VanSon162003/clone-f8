import { useEffect, useState } from "react";

function useRoll() {
    const [isroll, setIsRoll] = useState(false);

    useEffect(() => {
        isroll && (document.body.style.overflow = "hidden");
        !isroll && (document.body.style.overflow = "auto");
    }, [isroll]);

    return [setIsRoll];
}

export default useRoll;
