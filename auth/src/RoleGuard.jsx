import PropTypes from "prop-types";
import { useAuth } from "./useAuth";
import { Outlet } from "react-router-dom";

export function RoleGuard({ allowedRoles }) {
    const auth = useAuth();

    if (!allowedRoles.includes(auth.user.profile.app_metadata.role)) {
        return <p>You do not have permission to view this resource</p>;
    }

    return <Outlet />;
}

RoleGuard.propTypes = {
    allowedRoles: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
};
