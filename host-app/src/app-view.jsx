import { LogoutButton } from "auth";
import { Outlet } from "react-router-dom";

export function AppView() {
    return (
        <>
            <LogoutButton />
            <Outlet />
        </>
    );
}
