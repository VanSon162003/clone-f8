import { useState } from "react";

function useAuth() {
    const [data, setData] = useState({});
    const [errs, setErrs] = useState({});

    const fetchAuth = async (url, form) => {
        setErrs({});
        try {
            const res = await fetch(
                `https://api01.f8team.dev/api/auth/${url}`,
                {
                    headers: { "Content-Type": "application/json" },
                    method: "POST",
                    body: JSON.stringify(form),
                }
            );

            if (!res.ok) {
                const errorText = await res.text();
                throw new Error(errorText);
            }

            const data = await res.json();
            setData(data);
        } catch (err) {
            setErrs(JSON.parse(err.message));
        }
    };

    return [data, errs, setErrs, fetchAuth];
}

export default useAuth;
