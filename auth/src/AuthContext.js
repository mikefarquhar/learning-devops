import { createContext } from "react";

export const AuthContext = createContext({
    loaded: false,
    authenticated: false,
    user: null,
    error: null,
    login: () => {},
    loginCallback: () => {},
    logout: () => {},
    logoutCallback: () => {},
});

AuthContext.displayName = `Auth`;
