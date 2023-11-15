import { useAuth } from "./useAuth";

export function LogoutButton() {
    const auth = useAuth();
    const nextUrl = window.location.pathname;

    return (
        <button onClick={() => auth.logout({ state: nextUrl })}>Logout</button>
    );
}
