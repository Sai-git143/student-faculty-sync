
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  otpCode: string;
  template?: 'verification' | 'reset_password' | 'login';
  metadata?: Record<string, string>;
}

// Rate limiting cache (in memory for demo purposes)
// In production, use Redis or similar for distributed rate limiting
const rateLimitCache = new Map<string, { count: number, timestamp: number }>();
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes

// Request validation with rate limiting
function validateOtpRequest(data: any): EmailRequest {
  if (!data.email || !data.otpCode) {
    throw new Error('Email and OTP code are required');
  }
  
  // Validate email format using regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }
  
  // Rate limiting check
  const ipKey = data.email.toLowerCase();
  const now = Date.now();
  const rateData = rateLimitCache.get(ipKey);
  
  if (rateData) {
    // Reset rate limit if window has expired
    if (now - rateData.timestamp > RATE_LIMIT_WINDOW_MS) {
      rateLimitCache.set(ipKey, { count: 1, timestamp: now });
    } else if (rateData.count >= MAX_ATTEMPTS) {
      const minutesLeft = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - rateData.timestamp)) / 60000);
      throw new Error(`Too many OTP requests. Please try again after ${minutesLeft} minutes.`);
    } else {
      // Increment counter
      rateLimitCache.set(ipKey, { count: rateData.count + 1, timestamp: rateData.timestamp });
    }
  } else {
    // First attempt
    rateLimitCache.set(ipKey, { count: 1, timestamp: now });
  }
  
  return data as EmailRequest;
}

// Get Supabase configuration
function getSupabaseConfig() {
  const config = {
    url: Deno.env.get('SUPABASE_URL') || '',
    key: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '',
  };

  if (!config.url || !config.key) {
    throw new Error('Missing Supabase URL or service role key');
  }

  return config;
}

// Create HTML email template
function createOtpEmailTemplate(otpCode: string, template = 'verification', metadata: Record<string, string> = {}): string {
  const appName = metadata.appName || 'University Portal';
  const userName = metadata.userName || 'User';
  const expiryMinutes = metadata.expiryMinutes || '10';
  const supportEmail = metadata.supportEmail || 'support@example.com';

  // Base styles for all templates
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
    
    case 'verification':
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

// Send email via send-email function
async function sendOtpEmail(email: string, otpCode: string, template?: 'verification' | 'reset_password' | 'login', metadata?: Record<string, string>): Promise<Response> {
  const { url, key } = getSupabaseConfig();
  const emailEndpoint = `${url}/functions/v1/send-email`;
  const htmlContent = createOtpEmailTemplate(otpCode, template, metadata);

  // Determine subject based on template
  let subject = 'Your Verification Code';
  if (template === 'reset_password') {
    subject = 'Reset Your Password';
  } else if (template === 'login') {
    subject = 'Login Verification Code';
  }

  console.log(`Preparing to send ${template || 'verification'} email to ${email} with OTP code ${otpCode}`);
  console.log(`Sending request to endpoint: ${emailEndpoint}`);
  
  const response = await fetch(emailEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      to: email,
      subject,
      html: htmlContent,
    }),
  });

  console.log(`Email endpoint responded with status: ${response.status}`);
  
  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.text();
      console.error('Error from email service:', errorData);
    } catch (err) {
      console.error('Could not parse error response:', err);
    }
    
    throw new Error(`Failed to send email: ${errorData || response.statusText}`);
  }

  // Get the original response data
  const responseData = await response.json();
  return new Response(
    JSON.stringify({
      success: true, 
      message: 'OTP email sent successfully',
      data: responseData,
      template,
      rateLimitInfo: {
        remainingAttempts: MAX_ATTEMPTS - (rateLimitCache.get(email.toLowerCase())?.count || 0),
        windowMs: RATE_LIMIT_WINDOW_MS
      }
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    }
  );
}

// Create error response
function createErrorResponse(error: Error, status = 500) {
  console.error('Error in send-otp-email function:', error);
  return new Response(
    JSON.stringify({ 
      error: error.message || 'Failed to send OTP email',
      stack: error.stack
    }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status,
    }
  );
}

// Main handler function
serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      headers: corsHeaders,
      status: 204,
    });
  }

  try {
    // Parse and validate request
    const requestData = await req.json();
    console.log("Received request data:", JSON.stringify({
      email: requestData.email,
      template: requestData.template || 'verification',
      metadata: requestData.metadata ? 'provided' : 'not provided'
    }));
    
    const { email, otpCode, template, metadata } = validateOtpRequest(requestData);
    
    // Send OTP email
    return await sendOtpEmail(email, otpCode, template, metadata);
  } catch (error) {
    // If error contains "minutes", it's a rate limit error
    if (error.message.includes('minutes')) {
      return createErrorResponse(error, 429); // Too Many Requests
    }
    // For validation errors, return 400
    if (error.message.includes('required') || error.message.includes('Invalid')) {
      return createErrorResponse(error, 400);
    }
    // For all other errors, return 500
    return createErrorResponse(error);
  }
});
