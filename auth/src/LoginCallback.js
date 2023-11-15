import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth";

export function LoginCallback() {
    const auth = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        auth.loginCallback()
            .then((response) => {
                const nextUrl = response.state;
                console.log({ type: "login-callback", nextUrl });
                navigate(nextUrl ?? "/", { replace: true });
            })
            .catch((error) => {
                console.error(error);
                navigate(window.location.origin, { replace: true });
            });
    }, []);

    return <p>Login callback</p>;
}
