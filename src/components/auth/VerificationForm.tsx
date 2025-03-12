
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle, Fingerprint, Key } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface VerificationFormProps {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  loading: boolean;
  resendDisabled: boolean;
  countdown: number;
  errorMessage: string | null;
  onVerify: (e: React.FormEvent) => Promise<void>;
  onResendOtp: () => Promise<void>;
  onBack: () => void;
}

export function VerificationForm({
  email,
  otp,
  setOtp,
  loading,
  resendDisabled,
  countdown,
  errorMessage,
  onVerify,
  onResendOtp,
  onBack
}: VerificationFormProps) {
  const [isBiometricAvailable, setIsBiometricAvailable] = useState(false);
  const [isVerifyingBiometric, setIsVerifyingBiometric] = useState(false);
  const [otpAutoFilled, setOtpAutoFilled] = useState(false);

  // Check if Web Authentication API is available
  useEffect(() => {
    const checkBiometricAvailability = async () => {
      try {
        if (window.PublicKeyCredential && 
            PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
          const available = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
          setIsBiometricAvailable(available);
        }
      } catch (error) {
        console.error("Error checking biometric availability:", error);
        setIsBiometricAvailable(false);
      }
    };

    checkBiometricAvailability();
  }, []);

  // Handle OTP auto-fill detection (for Android/iOS)
  useEffect(() => {
    const otpInput = document.getElementById('otp');
    if (otpInput) {
      const observer = new MutationObserver(() => {
        if (otpInput instanceof HTMLInputElement && otpInput.value.length === 4) {
          setOtpAutoFilled(true);
        }
      });
      
      observer.observe(otpInput, { 
        attributes: true, 
        attributeFilter: ['value'] 
      });
      
      return () => observer.disconnect();
    }
  }, []);

  // When OTP is auto-filled, auto-submit after a short delay
  useEffect(() => {
    if (otpAutoFilled && otp.length === 4 && !loading) {
      const timer = setTimeout(() => {
        onVerify(new Event('submit') as any);
      }, 500);
      
      return () => clearTimeout(timer);
    }
  }, [otpAutoFilled, otp, loading, onVerify]);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 4 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(value);
  };

  const handleBiometricVerify = async () => {
    try {
      setIsVerifyingBiometric(true);
      
      // This would typically interact with an authentication server
      // For demo purposes, we're just setting a successful OTP
      
      // In a real implementation, you would:
      // 1. Request a challenge from your server
      // 2. Call navigator.credentials.get() with the challenge
      // 3. Send the credential back to your server for verification
      // 4. If verified, bypass the OTP
      
      // Simulate successful biometric authentication after 1 second
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set OTP to the stored value (in a real app, this would be handled server-side)
      setOtp(otp || "1234");
      setOtpAutoFilled(true);
      
    } catch (error) {
      console.error("Biometric verification failed:", error);
    } finally {
      setIsVerifyingBiometric(false);
    }
  };

  return (
    <form onSubmit={onVerify} className="space-y-4">
      <div className="bg-muted/50 p-3 rounded-md mb-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="text-sm font-medium">Verification code sent</h3>
            <p className="text-xs text-muted-foreground mt-1">
              We've sent a 4-digit verification code to {email}
            </p>
          </div>
        </div>
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="py-2">
          <AlertCircle className="h-4 w-4 mr-2" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label htmlFor="otp" className="text-sm font-medium">
          Enter 4-digit verification code
        </label>
        <Input
          id="otp"
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={4}
          placeholder="4-digit code"
          value={otp}
          onChange={handleOtpChange}
          className="text-center text-lg tracking-widest"
          required
          autoComplete="one-time-code"
        />
        <p className="text-xs text-muted-foreground">
          Enter the 4-digit code we sent to your email
        </p>
      </div>

      {isBiometricAvailable && (
        <Button 
          type="button" 
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={handleBiometricVerify}
          disabled={loading || isVerifyingBiometric}
        >
          {isVerifyingBiometric ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              <Fingerprint className="h-4 w-4" />
              Verify with Biometrics
            </>
          )}
        </Button>
      )}
      
      <Button type="submit" className="w-full" disabled={loading || otp.length !== 4}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          <>
            <Key className="mr-2 h-4 w-4" />
            Verify Email
          </>
        )}
      </Button>
      
      <div className="flex justify-between items-center mt-4">
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={onBack}
          disabled={loading}
        >
          Back
        </Button>
        <Button 
          type="button" 
          variant="ghost" 
          size="sm"
          onClick={onResendOtp}
          disabled={resendDisabled || loading}
        >
          {resendDisabled 
            ? `Resend code in ${countdown}s` 
            : "Resend code"}
        </Button>
      </div>
    </form>
  );
}
