
export function createOtpEmailTemplate(
  otpCode: string, 
  template = 'verification', 
  metadata: Record<string, string> = {}
): string {
  const appName = metadata.appName || 'University Portal';
  const userName = metadata.userName || 'User';
  const expiryMinutes = metadata.expiryMinutes || '10';
  const supportEmail = metadata.supportEmail || 'support@example.com';

  const baseStyles = `
    body { font-family: Arial, sans-serif; color: #333; line-height: 1.6; margin: 0; padding: 0; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; }
    .header { background-color: #4F46E5; color: white; padding: 20px; border-radius: 10px 10px 0 0; margin: -20px -20px 20px; }
    .footer { font-size: 12px; color: #666; margin-top: 30px; padding-top: 10px; border-top: 1px solid #eee; }
    .otp-code { background-color: #f7f7f7; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0; }
    .button { display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; border-radius: 5px; text-decoration: none; font-weight: bold; }
  `;

  switch (template) {
    case 'reset_password':
      return `
        <html>
          <head><style>${baseStyles}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h2>${appName} - Password Reset</h2>
              </div>
              <p>Hello ${userName},</p>
              <p>We received a request to reset your password. Please use the following code to verify your identity:</p>
              <div class="otp-code">${otpCode}</div>
              <p>This code will expire in ${expiryMinutes} minutes.</p>
              <p>If you didn't request a password reset, please ignore this email or contact support at ${supportEmail}.</p>
              <div class="footer">
                <p>This is an automated message, please do not reply directly to this email.</p>
                <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    
    case 'login':
      return `
        <html>
          <head><style>${baseStyles}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h2>${appName} - Login Verification</h2>
              </div>
              <p>Hello ${userName},</p>
              <p>Please use the following verification code to complete your login:</p>
              <div class="otp-code">${otpCode}</div>
              <p>This code will expire in ${expiryMinutes} minutes.</p>
              <p>If you didn't attempt to log in, please contact support immediately at ${supportEmail}.</p>
              <div class="footer">
                <p>This is an automated message, please do not reply directly to this email.</p>
                <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
    
    default:
      return `
        <html>
          <head><style>${baseStyles}</style></head>
          <body>
            <div class="container">
              <div class="header">
                <h2>${appName} - Email Verification</h2>
              </div>
              <p>Hello ${userName},</p>
              <p>Thank you for registering with ${appName}. Please use the following verification code to complete your registration:</p>
              <div class="otp-code">${otpCode}</div>
              <p>This code will expire in ${expiryMinutes} minutes.</p>
              <p>If you didn't request this code, please ignore this email.</p>
              <div class="footer">
                <p>This is an automated message, please do not reply directly to this email.</p>
                <p>&copy; ${new Date().getFullYear()} ${appName}. All rights reserved.</p>
              </div>
            </div>
          </body>
        </html>
      `;
  }
}

