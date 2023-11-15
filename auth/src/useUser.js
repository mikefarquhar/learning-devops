import { useContext } from "react";
import { AuthContext } from "./AuthContext";

export function useUser() {
    const auth = useContext(AuthContext);
    const userData = auth.user.profile.app_metadata;
    return userData;
}
