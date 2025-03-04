
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

/**
 * Handles Supabase OTP errors and returns user-friendly messages
 */
export const handleOtpError = (error: any): string => {
  console.error("OTP send error:", error);
  
  // Rate limit error
  if (error.code === "over_email_send_rate_limit") {
    return error.message || "Too many attempts. Please try again later.";
  }
  
  // Invalid email
  if (error.message?.includes("invalid format")) {
    return "Please enter a valid email address.";
  }
  
  // Account already exists
  if (error.message?.includes("already exists")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  
  // Default error message
  return error.message || "Failed to send verification code. Please try again.";
};
