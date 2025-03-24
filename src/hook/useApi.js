import { useEffect, useState } from "react";

function useApi(url, body = {}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(url, body)
            .then((res) => res.json())
            .then((result) => {
                setData(result);
            });
    }, []);

    return data;
}

export default useApi;
