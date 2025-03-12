
export interface EmailRequest {
  email: string;
  otpCode: string;
  template?: 'verification' | 'reset_password' | 'login';
  metadata?: Record<string, string>;
}

export interface RateLimitData {
  count: number;
  timestamp: number;
}

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

