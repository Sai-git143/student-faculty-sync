
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  email: string;
  otpCode: string;
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
    const requestData = await req.json();
    const { email, otpCode } = requestData as EmailRequest;
    
    console.log("Received request data:", requestData);

    if (!email || !otpCode) {
      console.error("Missing required fields:", { email, otpCode });
      return new Response(
        JSON.stringify({ error: 'Email and OTP code are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get the Supabase API key from environment variable
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';

    if (!supabaseUrl || !supabaseKey) {
      console.error("Missing Supabase URL or service role key");
      throw new Error('Missing Supabase URL or service role key');
    }

    // Create HTML email content with OTP code
    const htmlContent = `
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

    console.log(`Preparing to send email to ${email} with OTP code ${otpCode}`);

    // Send email using Supabase Edge Functions Runtime API
    const emailEndpoint = `${supabaseUrl}/functions/v1/send-email`;
    console.log(`Sending request to endpoint: ${emailEndpoint}`);
    
    const response = await fetch(emailEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`,
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

    console.log("OTP email sent successfully");
    
    return new Response(
      JSON.stringify({ success: true, message: 'OTP email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-otp-email function:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Failed to send OTP email' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
