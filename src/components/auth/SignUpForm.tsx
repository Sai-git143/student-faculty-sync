
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

      // IMPORTANT: Explicitly set type to 'signup' and force OTP
      const { data, error: otpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userRole,
            email_domain: emailDomain,
          },
          emailRedirectTo: window.location.origin + '/auth/callback'
        }
      });

      if (otpError) throw otpError;

      // Check if the user needs to verify their email
      if (data?.user?.identities?.length === 0) {
        toast({
          title: "Account Exists",
          description: "An account with this email already exists. Please sign in instead.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // Send OTP for verification - explicitly use OTP-based verification
      const { error: phoneOtpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });

      if (phoneOtpError) throw phoneOtpError;

      setVerificationStep(true);
      toast({
        title: "OTP Sent",
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
      // Try to resend the OTP explicitly with OTP
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false
        }
      });

      if (otpError) throw otpError;

      toast({
        title: "OTP Resent",
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
      const { error: verifyError } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email'
      });

      if (verifyError) throw verifyError;
      
      toast({
        title: "Success",
        description: "Your account has been verified successfully.",
      });
      
      navigate("/");
    } catch (error: any) {
      const errorMsg = error.message || "Failed to verify account";
      toast({
        title: "Error",
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
