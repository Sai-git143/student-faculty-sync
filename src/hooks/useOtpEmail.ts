
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateOtpCode, handleOtpError } from "@/utils/emailValidation";
import { useToast } from "@/components/ui/use-toast";
import { useResendCountdown } from "./useResendCountdown";

export type OtpTemplateType = 'verification' | 'reset_password' | 'login';

interface SendOtpOptions {
  template?: OtpTemplateType;
  metadata?: {
    userName?: string;
    appName?: string;
    expiryMinutes?: string;
    supportEmail?: string;
    [key: string]: string | undefined;
  };
}

export function useOtpEmail() {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [rateLimitInfo, setRateLimitInfo] = useState<{
    remainingAttempts: number;
    windowMs: number;
  } | null>(null);
  const { toast } = useToast();
  
  const { 
    resendDisabled, 
    countdown, 
    errorMessage,
    startResendCountdown,
    setResendError,
    clearError
  } = useResendCountdown();

  const handleEmailResponse = (data: any) => {
    if (data?.rateLimitInfo) {
      setRateLimitInfo(data.rateLimitInfo);
      
      // Show remaining attempts if low
      if (data.rateLimitInfo.remainingAttempts <= 2) {
        toast({
          title: "Warning",
          description: `You have ${data.rateLimitInfo.remainingAttempts} attempts remaining before timeout.`,
          variant: "warning",
        });
      }
    }
  };

  const sendOtpEmail = async (email: string, options: SendOtpOptions = {}) => {
    setLoading(true);
    clearError();

    try {
      const newOtp = generateOtpCode();
      setGeneratedOtp(newOtp);
      
      console.log(`Sending 4-digit OTP to: ${email}`);
      console.log(`Generated OTP code: ${newOtp}`);
      
      const { error: emailError, data } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email, 
          otpCode: newOtp,
          template: options.template || 'verification',
          metadata: {
            ...options.metadata,
            appName: 'University Portal',
            expiryMinutes: '10',
            supportEmail: 'support@university.edu'
          }
        }
      });
      
      if (emailError) {
        console.error("Error sending OTP email:", emailError);
        throw emailError;
      }
      
      handleEmailResponse(data);
      
      // Use template-specific messages
      let toastMessage = `A 4-digit verification code has been sent to ${email}`;
      if (options.template === 'reset_password') {
        toastMessage = `A password reset code has been sent to ${email}`;
      } else if (options.template === 'login') {
        toastMessage = `A login verification code has been sent to ${email}`;
      }
      
      toast({
        title: "Code Sent",
        description: `${toastMessage}. Please check your inbox and spam folder.`,
      });
      
      startResendCountdown();
      return true;
    } catch (error: any) {
      const errorMsg = handleOtpError(error);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("OTP send error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const resendOtpEmail = async (email: string, options: SendOtpOptions = {}) => {
    if (resendDisabled) return false;
    
    setLoading(true);
    clearError();
    
    try {
      const newOtp = generateOtpCode();
      setGeneratedOtp(newOtp);
      
      console.log(`Resending OTP to: ${email}`);
      
      const { error: emailError, data } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email, 
          otpCode: newOtp,
          template: options.template,
          metadata: {
            ...options.metadata,
            appName: 'University Portal',
            expiryMinutes: '10',
            supportEmail: 'support@university.edu'
          }
        }
      });
      
      if (emailError) throw emailError;
      
      handleEmailResponse(data);
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email",
      });
      
      startResendCountdown();
      return true;
    } catch (error: any) {
      const errorMsg = handleOtpError(error);
      setResendError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("OTP resend error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    generatedOtp,
    loading,
    resendDisabled,
    countdown,
    errorMessage,
    rateLimitInfo,
    sendOtpEmail,
    resendOtpEmail,
    clearError
  };
}
