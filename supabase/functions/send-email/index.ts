
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

// CORS headers for all responses
export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
}

// Email configuration and validation
function getSmtpConfig() {
  const config = {
    host: Deno.env.get('SMTP_HOST') || '',
    port: parseInt(Deno.env.get('SMTP_PORT') || '587'),
    username: Deno.env.get('SMTP_USERNAME') || '',
    password: Deno.env.get('SMTP_PASSWORD') || '',
    from: Deno.env.get('EMAIL_FROM') || '',
  };

  if (!config.host || !config.username || !config.password || !config.from) {
    throw new Error('Missing SMTP configuration. Please check your environment variables.');
  }

  return config;
}

function validateEmailRequest(data: any): EmailRequest {
  if (!data.to || !data.subject || !data.html) {
    throw new Error('Email recipient, subject, and content are required');
  }
  return data as EmailRequest;
}

// Send email using SMTP
async function sendEmail(request: EmailRequest): Promise<void> {
  const config = getSmtpConfig();
  console.log(`SMTP configuration: host=${config.host}, port=${config.port}, username=${config.username}, from=${config.from}`);
  
  const client = new SmtpClient();
  try {
    console.log("Connecting to SMTP server");
    await client.connectTLS({
      hostname: config.host,
      port: config.port,
      username: config.username,
      password: config.password,
    });
    console.log("Connected to SMTP server successfully");

    console.log(`Sending email to ${request.to}`);
    await client.send({
      from: config.from,
      to: request.to,
      subject: request.subject,
      content: request.html,
      html: request.html,
    });
    console.log("Email sent successfully");
  } catch (error) {
    console.error("SMTP error:", error);
    throw error;
  } finally {
    try {
      await client.close();
      console.log("SMTP connection closed");
    } catch (closeError) {
      console.warn("Error closing SMTP connection:", closeError);
    }
  }
}

// Create error response
function createErrorResponse(error: Error, status = 500) {
  console.error('Error in send-email function:', error);
  return new Response(
    JSON.stringify({ 
      error: error.message || 'Failed to send email',
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
      to: requestData.to,
      subject: requestData.subject,
      html_length: requestData.html?.length || 0
    }));
    
    const emailRequest = validateEmailRequest(requestData);
    
    // Send email
    await sendEmail(emailRequest);
    
    // Return success response
    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    // For validation errors, return 400
    if (error.message.includes('required')) {
      return createErrorResponse(error, 400);
    }
    // For all other errors, return 500
    return createErrorResponse(error);
  }
});
