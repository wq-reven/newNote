export const hasRoles = (targetRoles, userRoles) => {
    for (let role of userRoles) {
        if (targetRoles.includes(role)) {
            return true;
        }
    }
    return false;
};
