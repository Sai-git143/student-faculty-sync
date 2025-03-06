
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { generateOtpCode, handleOtpError } from "@/utils/emailValidation";
import { useToast } from "@/components/ui/use-toast";
import { useResendCountdown } from "./useResendCountdown";

export function useOtpEmail() {
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  
  const { 
    resendDisabled, 
    countdown, 
    errorMessage,
    startResendCountdown,
    setResendError,
    clearError
  } = useResendCountdown();

  const sendOtpEmail = async (email: string) => {
    setLoading(true);
    clearError();

    try {
      // Generate a 4-digit OTP code
      const newOtp = generateOtpCode();
      setGeneratedOtp(newOtp);
      
      console.log("Sending 4-digit OTP to:", email);
      console.log("Generated OTP code:", newOtp);
      
      // Use custom email template with OTP code
      const { error: emailError, data } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email, 
          otpCode: newOtp
        }
      });
      
      console.log("Email function response:", data);
      
      if (emailError) {
        console.error("Error sending OTP email:", emailError);
        throw emailError;
      }
      
      toast({
        title: "Verification Code Sent",
        description: `A 4-digit verification code has been sent to ${email}. Please check your inbox and spam folder.`,
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

  const resendOtpEmail = async (email: string) => {
    if (resendDisabled) return false;
    
    setLoading(true);
    clearError();
    
    try {
      // Generate a new 4-digit OTP code
      const newOtp = generateOtpCode();
      setGeneratedOtp(newOtp);
      
      console.log("Resending 4-digit OTP to:", email);
      console.log("New generated OTP code:", newOtp);
      
      // Use custom email template with OTP code
      const { error: emailError, data } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email, 
          otpCode: newOtp
        }
      });
      
      console.log("Resend email function response:", data);
      
      if (emailError) {
        console.error("Error resending OTP email:", emailError);
        throw emailError;
      }
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email. Please check your inbox and spam folder.",
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
    sendOtpEmail,
    resendOtpEmail,
    clearError
  };
}
