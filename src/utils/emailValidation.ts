
/**
 * Validates if the email matches the allowed domain patterns
 */
export const validateEmail = (email: string): boolean => {
  return email.endsWith('@university.edu') || 
         email.endsWith('@admin.university.edu') ||
         email.endsWith('@faculty.university.edu') ||
         email.endsWith('@gmail.com');
};

/**
 * Gets the email domain from an email address
 */
export const getEmailDomain = (email: string): string => {
  return email.substring(email.indexOf('@'));
};

/**
 * Determines the appropriate role based on email domain
 */
export const determineRoleFromEmail = (email: string, selectedRole: string): string => {
  const emailDomain = getEmailDomain(email);
  
  if (emailDomain === '@admin.university.edu') {
    return 'admin';
  } else if (emailDomain === '@faculty.university.edu') {
    return 'faculty';
  }
  
  return selectedRole;
};
