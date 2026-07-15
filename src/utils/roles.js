export const ROLES = {
  STUDENT: 'student',
  PARENT: 'parent',
  FACULTY: 'faculty',
  SUPER_ADMIN: 'super_admin',
}

export const ROLE_OPTIONS = [
  { value: ROLES.STUDENT, label: 'Student' },
  { value: ROLES.PARENT, label: 'Parent' },
  { value: ROLES.FACULTY, label: 'Faculty' },
  { value: ROLES.SUPER_ADMIN, label: 'Super Admin' },
]

/** Subset shown in the main Navbar login modal (Student & Parent only). */
export const STUDENT_ROLE_OPTIONS = [
  { value: ROLES.STUDENT, label: 'Student' },
  { value: ROLES.PARENT, label: 'Parent' },
]

export const hasRequiredRole = (userRole, allowedRoles = []) => {
  if (!userRole) {
    return false
  }

  if (userRole === ROLES.SUPER_ADMIN) {
    return true
  }

  if (!allowedRoles.length) {
    return true
  }

  return allowedRoles.includes(userRole)
}
