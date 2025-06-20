// Role-related constants and utilities
export const ROLE_ICONS = {
  student: '🎓',
  instructor: '👨\u200d🏫',
  admin: '👑',
  default: '👤'
};

export const ROLE_BADGE_CLASSES = {
  admin: 'role-admin',
  instructor: 'role-instructor',
  student: 'role-student',
  default: 'role-default'
};

export const getRoleIcon = (role) => ROLE_ICONS[role] || ROLE_ICONS.default;

export const getRoleBadgeClass = (role) => ROLE_BADGE_CLASSES[role] || ROLE_BADGE_CLASSES.default;
