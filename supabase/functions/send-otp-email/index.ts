
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  otpCode: string;
}

// Request validation
function validateOtpRequest(data: any): EmailRequest {
  if (!data.email || !data.otpCode) {
    throw new Error('Email and OTP code are required');
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
function createOtpEmailTemplate(otpCode: string): string {
  return `
    <html>
      <body style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
        <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4F46E5;">Your Verification Code</h2>
          <p>Thank you for registering. Please use the following 4-digit code to verify your email address:</p>
          <div style="background-color: #f7f7f7; padding: 15px; border-radius: 5px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
            ${otpCode}
          </div>
          <p>This code will expire in 10 minutes.</p>
          <p>If you didn't request this code, please ignore this email.</p>
        </div>
      </body>
    </html>
  `;
}

// Send email via send-email function
async function sendOtpEmail(email: string, otpCode: string): Promise<Response> {
  const { url, key } = getSupabaseConfig();
  const emailEndpoint = `${url}/functions/v1/send-email`;
  const htmlContent = createOtpEmailTemplate(otpCode);

  console.log(`Preparing to send email to ${email} with OTP code ${otpCode}`);
  console.log(`Sending request to endpoint: ${emailEndpoint}`);
  
  const response = await fetch(emailEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${key}`,
    },
    body: JSON.stringify({
      to: email,
      subject: 'Your Verification Code',
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
      data: responseData
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
    console.log("Received request data:", requestData);
    
    const { email, otpCode } = validateOtpRequest(requestData);
    
    // Send OTP email
    return await sendOtpEmail(email, otpCode);
  } catch (error) {
    // For validation errors, return 400
    if (error.message.includes('required')) {
      return createErrorResponse(error, 400);
    }
    // For all other errors, return 500
    return createErrorResponse(error);
  }
});
