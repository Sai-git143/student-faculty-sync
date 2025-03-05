
/**
 * Validates if the email matches the allowed domain patterns
 */
export const validateEmail = (email: string): boolean => {
  // Check for valid email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return false;
  
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
  console.error("OTP error:", error);
  
  // Rate limit error
  if (error.code === "too_many_requests" || 
      error.code === "over_email_send_rate_limit" || 
      error.message?.includes("rate limit") || 
      error.message?.includes("too many requests")) {
    return error.message || "Too many attempts. Please try again later.";
  }
  
  // Invalid email
  if (error.message?.includes("invalid format") || 
      error.message?.includes("Invalid email")) {
    return "Please enter a valid email address.";
  }
  
  // Account already exists
  if (error.message?.includes("already exists") ||
      error.message?.includes("User already registered")) {
    return "An account with this email already exists. Please sign in instead.";
  }
  
  // Invalid OTP
  if (error.message?.includes("Invalid OTP") ||
      error.message?.includes("invalid one-time password")) {
    return "Invalid verification code. Please check and try again.";
  }
  
  // Expired OTP
  if (error.message?.includes("expired") ||
      error.message?.includes("out of date")) {
    return "Verification code has expired. Please request a new one.";
  }
  
  // Default error message
  return error.message || "Failed to send verification code. Please try again.";
};
