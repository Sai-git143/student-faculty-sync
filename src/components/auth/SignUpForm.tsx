
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
      // Determine appropriate role based on email domain
      const userRole = determineRoleFromEmail(email, role);
      const emailDomain = email.substring(email.indexOf('@'));

      // IMPORTANT: First create the user account
      const { data: userData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userRole,
            email_domain: emailDomain,
          },
          // Don't auto-confirm emails - we'll use OTP instead
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });

      if (signUpError) throw signUpError;

      // Check if the user needs to verify their email
      if (userData?.user?.identities?.length === 0) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      console.log("User created successfully:", userData);
      
      // Explicitly send OTP for verification
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          // Force OTP (numeric code) instead of magic link
          emailRedirectTo: null,
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
      console.error("Account creation or OTP send error:", error);
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
          shouldCreateUser: false,
          // Force OTP (numeric code) instead of magic link
          emailRedirectTo: null,
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
      // Verify the OTP code
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (verifyError) throw verifyError;
      
      toast({
        title: "Account Verified",
        description: "Your account has been verified successfully. You can now sign in.",
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
