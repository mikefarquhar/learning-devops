import { useAuth } from "./useAuth";
import { useEffect } from "react";
import { Outlet } from "react-router-dom";

export function AuthGuard() {
    const auth = useAuth();

    useEffect(() => {
        if (auth.loaded && !auth.authenticated) {
            auth.login({ state: window.location.pathname });
        }
    }, [auth]);

    if (!auth.authenticated) {
        return null;
    }

    return <Outlet />;
}
