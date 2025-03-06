
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
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
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow digits and limit to 4 characters
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setOtp(value);
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
        />
        <p className="text-xs text-muted-foreground">
          Enter the 4-digit code we sent to your email
        </p>
      </div>
      <Button type="submit" className="w-full" disabled={loading || otp.length !== 4}>
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify Email"
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
