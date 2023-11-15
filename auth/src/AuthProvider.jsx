import { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { UserManager } from "oidc-client-ts";
import { AuthContext } from "./AuthContext";

export function AuthProvider({ userManager, children }) {
    const [state, setState] = useState({
        loaded: false,
        authenticated: false,
        error: null,
        user: null,
    });

    const setUser = useCallback((user) => {
        setState({
            loaded: true,
            authenticated: !(user?.expired ?? true),
            error: null,
            user,
        });
    }, []);

    const setError = useCallback((error) => {
        setState({
            loaded: true,
            authenticated: false,
            error,
            user: null,
        });
    });

    useEffect(() => {
        const unsetUser = () => setUser(null);

        userManager.events.addUserLoaded(setUser);
        userManager.events.addAccessTokenExpired(unsetUser);
        userManager.events.addUserSignedOut(unsetUser);
        userManager.events.addSilentRenewError(setError);

        return () => {
            userManager.events.removeUserLoaded(setUser);
            userManager.events.removeAccessTokenExpired(unsetUser);
            userManager.events.removeUserSignedOut(unsetUser);
            userManager.events.removeSilentRenewError(setError);
        };
    }, [userManager]);

    useEffect(() => {
        (async () => {
            try {
                const user = await userManager.getUser();
                setUser(user);
            } catch (error) {
                setError(error);
            }
        })();
    }, [userManager]);

    const login = useCallback(
        (args) => userManager.signinRedirect(args),
        [userManager],
    );

    const loginCallback = useCallback(
        (url) => userManager.signinRedirectCallback(url),
        [userManager],
    );

    const logout = useCallback(
        (args) => userManager.signoutRedirect(args),
        [userManager],
    );

    const logoutCallback = useCallback(
        (url) => userManager.signoutRedirectCallback(url),
        [userManager],
    );

    if (!state.loaded) {
        return <p>Loading...</p>;
    }

    if (state.error) {
        return <p>Error: {state.error}</p>;
    }

    return (
        <AuthContext.Provider
            value={{
                ...state,
                login,
                loginCallback,
                logout,
                logoutCallback,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

AuthProvider.propTypes = {
    userManager: PropTypes.instanceOf(UserManager).isRequired,
    children: PropTypes.node,
};
