import { getFarmMembership } from "../models/farmModel.js";

// Checks the logged-in user belongs to the farm in the route params.
// Optionally restrict to specific roles, e.g. requireFarmRole(['owner'])
export const requireFarmMembership = (allowedRoles = null) => {
  return async (req, res, next) => {
    try {
      const farmId = req.params.farmId;

      if (!farmId) {
        return res
          .status(400)
          .json({ error: "farmId is required in the route" });
      }

      const membership = await getFarmMembership(req.userId, farmId);

      if (!membership) {
        return res.status(403).json({ error: "Not a member of this farm" });
      }

      if (allowedRoles && !allowedRoles.includes(membership.role)) {
        return res.status(403).json({
          error: `Requires one of these roles: ${allowedRoles.join(", ")}`,
        });
      }

      req.farmRole = membership.role;
      next();
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Failed to verify farm membership" });
    }
  };
};
export const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.farmRole) {
      return res.status(403).json({ error: "Farm membership not verified" });
    }
    if (!allowedRoles.includes(req.farmRole)) {
      return res.status(403).json({
        error: `Requires one of these roles: ${allowedRoles.join(", ")}`,
      });
    }
    next();
  };
};
