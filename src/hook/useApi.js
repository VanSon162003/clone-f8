import { useEffect, useState } from "react";

function useApi(url, body = {}) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:3000${url}`, body)
            .then((res) => res.json())
            .then((result) => {
                setData(result);
            });
    }, [url]);

    return data;
}

export default useApi;
