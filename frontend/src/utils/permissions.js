export const ROLES = {
  ADMIN: 'ADMIN',
  BASE_COMMANDER: 'BASE_COMMANDER',
  LOGISTICS_OFFICER: 'LOGISTICS_OFFICER',
};

export const hasRole = (user, allowedRoles) => {
  if (!user || !user.role) return false;
  if (!allowedRoles || allowedRoles.length === 0) return true;
  return allowedRoles.includes(user.role);
};

export const isAdmin = (user) => user?.role === ROLES.ADMIN;
export const isCommander = (user) => user?.role === ROLES.BASE_COMMANDER;
export const isLogistics = (user) => user?.role === ROLES.LOGISTICS_OFFICER;

export const canManagePurchases = (user) => [ROLES.ADMIN, ROLES.LOGISTICS_OFFICER, ROLES.BASE_COMMANDER].includes(user?.role);
export const canManageTransfers = (user) => [ROLES.ADMIN, ROLES.LOGISTICS_OFFICER, ROLES.BASE_COMMANDER].includes(user?.role);
export const canAssignAssets = (user) => [ROLES.ADMIN, ROLES.BASE_COMMANDER].includes(user?.role);
export const canRecordExpenditure = (user) => [ROLES.ADMIN, ROLES.BASE_COMMANDER, ROLES.LOGISTICS_OFFICER].includes(user?.role);
export const canManageUsers = (user) => user?.role === ROLES.ADMIN;
