import { useEffect, useState } from "react";

function getApi(url) {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((result) => {
                setData(result);
            });
    }, []);

    return data;
}

export default getApi;
