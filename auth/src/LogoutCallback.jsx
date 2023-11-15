import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";
import { useEffect } from "react";

export function LogoutCallback() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth.logoutCallback()
            .then((response) => {
                const nextUrl = response.userState;
                console.log({ type: "logout-callback", nextUrl });
                navigate(nextUrl ?? "/", { replace: true });
            })
            .catch((error) => {
                console.error(error);
                navigate("/", { replace: true });
            });
    }, []);

    return <p>Logout callback</p>;
}
