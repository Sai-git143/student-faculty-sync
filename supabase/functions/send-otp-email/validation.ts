
import { EmailRequest } from './types.ts';

export function validateEmailRequest(data: any): EmailRequest {
  if (!data.email || !data.otpCode) {
    throw new Error('Email and OTP code are required');
  }
  
  // Validate email format using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }
  
  return data as EmailRequest;
}

