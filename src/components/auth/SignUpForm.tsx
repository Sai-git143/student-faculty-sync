
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { SignUpInitialForm } from "./SignUpInitialForm";
import { VerificationForm } from "./VerificationForm";
import { validateEmail, determineRoleFromEmail, handleOtpError } from "@/utils/emailValidation";
import { useResendCountdown } from "@/hooks/useResendCountdown";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
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

    // Validate email
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
      // Skip creating user account first, directly send OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true, // Create user if they don't exist
          emailRedirectTo: null, // Force numeric code instead of magic link
        }
      });

      if (otpError) throw otpError;

      setVerificationStep(true);
      toast({
        title: "Verification Code Sent",
        description: `A verification code has been sent to ${email}. Please check your inbox and spam folder.`,
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
      // Send OTP explicitly with options to force numeric code
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: true,
          emailRedirectTo: null, // Force OTP (numeric code)
        }
      });

      if (otpError) throw otpError;

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
      // Verify the OTP code and set password
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'signup',
        options: {
          data: {
            password,
            role: determineRoleFromEmail(email, role),
            email_domain: email.substring(email.indexOf('@')),
          }
        }
      });

      if (verifyError) throw verifyError;
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. You are now signed in.",
      });
      
      // Navigate to home page after successful verification
      navigate("/");
    } catch (error: any) {
      const errorMsg = error.message || "Failed to verify account";
      toast({
        title: "Verification Error",
        description: errorMsg,
        variant: "destructive",
      });
      setResendError(errorMsg);
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
