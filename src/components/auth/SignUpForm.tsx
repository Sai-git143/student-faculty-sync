
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { SignUpInitialForm } from "./SignUpInitialForm";
import { VerificationForm } from "./VerificationForm";
import { validateEmail, determineRoleFromEmail, handleOtpError, generateOtpCode } from "@/utils/emailValidation";
import { useResendCountdown } from "@/hooks/useResendCountdown";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const { 
    resendDisabled, 
    countdown, 
    errorMessage,
    startResendCountdown,
    setResendError,
    clearError
  } = useResendCountdown();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    if (!validateEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please use a valid email address (@university.edu, @admin.university.edu, or @gmail.com)",
        variant: "destructive",
      });
      setLoading(false);
      return;
    }

    try {
      // Generate a 4-digit OTP code
      const newOtp = generateOtpCode();
      setGeneratedOtp(newOtp);
      
      console.log("Sending 4-digit OTP to:", email);
      console.log("Generated OTP code:", newOtp);
      
      // Use custom email template with OTP code
      const { error: emailError } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email, 
          otpCode: newOtp
        }
      });
      
      if (emailError) {
        console.error("Error sending OTP email:", emailError);
        throw emailError;
      }
      
      setVerificationStep(true);
      toast({
        title: "Verification Code Sent",
        description: `A 4-digit verification code has been sent to ${email}. Please check your inbox and spam folder.`,
      });
      startResendCountdown();
    } catch (error: any) {
      const errorMsg = handleOtpError(error);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("OTP send error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setLoading(true);
    clearError();
    
    try {
      // Generate a new 4-digit OTP code
      const newOtp = generateOtpCode();
      setGeneratedOtp(newOtp);
      
      console.log("Resending 4-digit OTP to:", email);
      console.log("New generated OTP code:", newOtp);
      
      // Use custom email template with OTP code
      const { error: emailError } = await supabase.functions.invoke('send-otp-email', {
        body: { 
          email, 
          otpCode: newOtp
        }
      });
      
      if (emailError) {
        console.error("Error resending OTP email:", emailError);
        throw emailError;
      }
      
      toast({
        title: "Code Resent",
        description: "A new verification code has been sent to your email. Please check your inbox and spam folder.",
      });
      startResendCountdown();
    } catch (error: any) {
      const errorMsg = handleOtpError(error);
      setResendError(errorMsg);
      toast({
        title: "Error",
        description: errorMsg,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    clearError();

    try {
      console.log("Verifying OTP input:", otp);
      console.log("Against generated OTP:", generatedOtp);
      
      // Check if the entered OTP matches the generated OTP
      if (otp !== generatedOtp) {
        throw new Error("Invalid verification code. Please check and try again.");
      }
      
      console.log("OTP verified successfully. Creating account...");
      
      // Create user with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: determineRoleFromEmail(email, role),
            email_domain: email.substring(email.indexOf('@')),
          }
        }
      });
      
      console.log("Sign up response:", signUpData);
      
      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. You are now signed in.",
      });
      
      navigate("/");
    } catch (error: any) {
      const errorMsg = error.message || "Failed to verify account";
      toast({
        title: "Verification Error",
        description: errorMsg,
        variant: "destructive",
      });
      setResendError(errorMsg);
      console.error("Verification process error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!verificationStep ? (
        <SignUpInitialForm
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          role={role}
          setRole={setRole}
          loading={loading}
          onSubmit={handleSignUp}
        />
      ) : (
        <VerificationForm
          email={email}
          otp={otp}
          setOtp={setOtp}
          loading={loading}
          resendDisabled={resendDisabled}
          countdown={countdown}
          errorMessage={errorMessage}
          onVerify={handleVerifyOtp}
          onResendOtp={handleResendOtp}
          onBack={() => setVerificationStep(false)}
        />
      )}
    </>
  );
}
