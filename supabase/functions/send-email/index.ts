
import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { SmtpClient } from 'https://deno.land/x/smtp@v0.7.0/mod.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailRequest {
  to: string;
  subject: string;
  html: string;
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
    console.log("Received request data:", JSON.stringify({
      to: requestData.to,
      subject: requestData.subject,
      html_length: requestData.html?.length || 0
    }));
    
    const { to, subject, html } = requestData as EmailRequest;

    if (!to || !subject || !html) {
      console.error("Missing required email fields");
      return new Response(
        JSON.stringify({ error: 'Email recipient, subject, and content are required' }),
        {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          status: 400,
        }
      );
    }

    // Get SMTP settings from environment variables
    const smtpHost = Deno.env.get('SMTP_HOST') || '';
    const smtpPort = parseInt(Deno.env.get('SMTP_PORT') || '587');
    const smtpUsername = Deno.env.get('SMTP_USERNAME') || '';
    const smtpPassword = Deno.env.get('SMTP_PASSWORD') || '';
    const emailFrom = Deno.env.get('EMAIL_FROM') || '';

    console.log(`SMTP configuration: host=${smtpHost}, port=${smtpPort}, username=${smtpUsername}, from=${emailFrom}`);

    if (!smtpHost || !smtpUsername || !smtpPassword || !emailFrom) {
      console.error("Missing SMTP configuration");
      throw new Error('Missing SMTP configuration. Please check your environment variables.');
    }

    // Configure SMTP client
    console.log("Initializing SMTP client");
    const client = new SmtpClient();
    
    console.log("Connecting to SMTP server");
    try {
      await client.connectTLS({
        hostname: smtpHost,
        port: smtpPort,
        username: smtpUsername,
        password: smtpPassword,
      });
      console.log("Connected to SMTP server successfully");
    } catch (connError) {
      console.error("SMTP connection error:", connError);
      throw new Error(`SMTP connection failed: ${connError.message}`);
    }

    // Send email
    console.log(`Sending email to ${to}`);
    try {
      await client.send({
        from: emailFrom,
        to: to,
        subject: subject,
        content: html,
        html: html,
      });
      console.log("Email sent successfully");
    } catch (sendError) {
      console.error("Error sending email:", sendError);
      throw new Error(`Failed to send email: ${sendError.message}`);
    }

    try {
      await client.close();
      console.log("SMTP connection closed");
    } catch (closeError) {
      console.warn("Error closing SMTP connection:", closeError);
    }

    return new Response(
      JSON.stringify({ success: true, message: 'Email sent successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );
  } catch (error) {
    console.error('Error in send-email function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to send email',
        stack: error.stack
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});
