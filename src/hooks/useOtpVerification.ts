
import { useState } from "react";
import { validateEmail } from "@/utils/emailValidation";
import { useToast } from "@/components/ui/use-toast";
import { useOtpEmail } from "./useOtpEmail";
import { useUserRegistration } from "./useUserRegistration";

export function useOtpVerification() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const { 
    generatedOtp,
    loading: otpLoading,
    resendDisabled,
    countdown,
    errorMessage,
    rateLimitInfo,
    sendOtpEmail,
    resendOtpEmail,
    clearError
  } = useOtpEmail();

  const {
    loading: registrationLoading,
    registerUser
  } = useUserRegistration();

  const loading = otpLoading || registrationLoading;

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use a valid email address (@university.edu, @admin.university.edu, or @gmail.com)",
        variant: "destructive",
      });
      return;
    }

    const success = await sendOtpEmail(email, {
      metadata: {
        userName: email.split('@')[0],
      }
    });
    
    if (success) {
      setVerificationStep(true);
      
      // Show remaining attempts if provided
      if (rateLimitInfo && rateLimitInfo.remainingAttempts <= 2) {
        toast({
          title: "Note",
          description: `You have ${rateLimitInfo.remainingAttempts} verification attempts remaining.`,
          variant: "destructive", // Changed from "warning" to "destructive"
        });
      }
    }
  };

  const handleResendOtp = async () => {
    await resendOtpEmail(email, {
      metadata: {
        userName: email.split('@')[0],
      }
    });
  };

  const handleVerifyOtp = async (e: React.FormEvent, navigate: any) => {
    e.preventDefault();
    clearError();

    try {
      console.log("Verifying OTP input:", otp);
      console.log("Against generated OTP:", generatedOtp);
      
      if (otp !== generatedOtp) {
        throw new Error("Invalid verification code. Please check and try again.");
      }
      
      await registerUser(email, password, role, navigate);
    } catch (error: any) {
      const errorMsg = error.message || "Failed to verify account";
      toast({
        title: "Verification Error",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("Verification process error:", error);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    role,
    setRole,
    loading,
    verificationStep,
    setVerificationStep,
    otp,
    setOtp,
    resendDisabled,
    countdown,
    errorMessage,
    handleSendOtp,
    handleResendOtp,
    handleVerifyOtp
  };
}

