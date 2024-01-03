

const checkRoles = (roleName) => {
  return async (req, res, next) => {
    try {
      const tokenData = req.tokenData;
      console.log("See", tokenData)
      const roles = tokenData.realm_access.roles;
      console.log("See", roles)

      // Check if the user has the specified role
      const hasRole = roles.includes(roleName) ||
      (tokenData.resource_access.accounting && tokenData.resource_access.accounting.roles.includes(roleName)) ||
      (tokenData.resource_access.hrms && tokenData.resource_access.hrms.roles.includes(roleName));
      if (hasRole) {
        // If user has the specified role, proceed.
        next();
      } else {
        // Throw error if user does not have the specified role
        const error = new Error(`Access Denied: You are not ${roleName}.`);
        error.statusCode = 401;
        throw error;
      }
    } catch (error) {
      next(error);
    }
  };
};


module.exports = {
  checkRoles,
};