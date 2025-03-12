
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

export async function sendEmail(to: string, subject: string, html: string): Promise<void> {
  const config = getSmtpConfig();
  console.log(`SMTP configuration: host=${config.host}, port=${config.port}, username=${config.username}, from=${config.from}`);
  
  // Logic for sending email would go here
  // This is a placeholder since the original code's email sending implementation wasn't shown
  console.log(`Sending email to ${to} with subject: ${subject}`);
}

