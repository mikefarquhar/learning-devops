import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import {
    AuthProvider,
    LoginCallback,
    LogoutCallback,
    AuthGuard,
    RoleGuard,
} from "auth";
import { Home } from "./home";
import { About } from "./about";
import { NotFound } from "./not-found";
import { Restricted } from "./restricted";
import { AppView } from "./app-view";

const userManager = new UserManager({
    authority: process.env.OIDC_AUTHORITY,
    client_id: process.env.OIDC_CLIENT_ID,
    redirect_uri: process.env.OIDC_LOGIN_REDIRECT_URI,
    post_logout_redirect_uri: process.env.OIDC_LOGOUT_REDIRECT_URI,
    automaticSilentRenew: true,
    response_type: "code",
    scope: "openid read write",
    userStore: new WebStorageStateStore({ store: window.localStorage }),
});

export function App() {
    return (
        <AuthProvider userManager={userManager}>
            <Router>
                <Routes>
                    <Route path="/login-callback" element={<LoginCallback />} />
                    <Route
                        path="/logout-callback"
                        element={<LogoutCallback />}
                    />
                    <Route path="/" element={<AuthGuard />}>
                        <Route path="/" element={<AppView />}>
                            <Route path="/" element={<Home />} />
                            <Route path="/about" element={<About />} />
                            <Route
                                path="/restricted"
                                element={
                                    <RoleGuard allowedRoles={["TEACHER"]} />
                                }
                            >
                                <Route
                                    path="/restricted"
                                    element={<Restricted />}
                                />
                            </Route>
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}
