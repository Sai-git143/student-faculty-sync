
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, CheckCircle } from "lucide-react";

interface VerificationFormProps {
  email: string;
  otp: string;
  setOtp: (otp: string) => void;
  loading: boolean;
  resendDisabled: boolean;
  countdown: number;
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
  onVerify,
  onResendOtp,
  onBack
}: VerificationFormProps) {
  return (
    <form onSubmit={onVerify} className="space-y-4">
      <div className="bg-muted/50 p-3 rounded-md mb-4">
        <div className="flex items-start gap-3">
          <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h3 className="text-sm font-medium">Verification code sent</h3>
            <p className="text-xs text-muted-foreground mt-1">
              We've sent a verification code to {email}
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-2">
        <label htmlFor="otp" className="text-sm font-medium">
          Enter verification code
        </label>
        <Input
          id="otp"
          type="text"
          placeholder="6-digit code"
          value={otp}
          onChange={(e) => setOtp(e.target.value.trim())}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={loading}>
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
