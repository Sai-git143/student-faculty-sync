
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { corsHeaders } from './types.ts';
import { validateEmailRequest } from './validation.ts';
import { checkRateLimit, getRateLimitInfo } from './rate-limiter.ts';
import { createOtpEmailTemplate } from './email-templates.ts';
import { sendEmail } from './email-service.ts';

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
    
    const { email, otpCode, template, metadata } = validateEmailRequest(requestData);
    
    // Check rate limiting
    checkRateLimit(email.toLowerCase());
    
    // Generate email content
    const htmlContent = createOtpEmailTemplate(otpCode, template, metadata);
    
    // Determine subject based on template
    let subject = 'Your Verification Code';
    if (template === 'reset_password') {
      subject = 'Reset Your Password';
    } else if (template === 'login') {
      subject = 'Login Verification Code';
    }

    // Send email
    await sendEmail(email, subject, htmlContent);
    
    // Get rate limit info for response
    const rateLimitInfo = getRateLimitInfo(email.toLowerCase());
    
    // Return success response
    return new Response(
      JSON.stringify({
        success: true, 
        message: 'OTP email sent successfully',
        template,
        rateLimitInfo
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error: any) {
    // Handle different types of errors
    if (error.message.includes('minutes')) {
      return createErrorResponse(error, 429); // Too Many Requests
    }
    if (error.message.includes('required') || error.message.includes('Invalid')) {
      return createErrorResponse(error, 400);
    }
    return createErrorResponse(error);
  }
});

