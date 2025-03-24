import { useLocation } from "react-router-dom";

function useQuery() {
    const location = useLocation();

    const param = new URLSearchParams(location.search);

    const path = encodeURIComponent(location.pathname);
    return { param, path };
}

export default useQuery;
