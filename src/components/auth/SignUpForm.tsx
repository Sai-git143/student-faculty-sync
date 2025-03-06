
import { useNavigate } from "react-router-dom";
import { SignUpInitialForm } from "./SignUpInitialForm";
import { VerificationForm } from "./VerificationForm";
import { useOtpVerification } from "@/hooks/useOtpVerification";

export function SignUpForm() {
  const navigate = useNavigate();
  
  const {
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
  } = useOtpVerification();

  const onVerify = (e: React.FormEvent) => handleVerifyOtp(e, navigate);

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
          onSubmit={handleSendOtp}
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
          onVerify={onVerify}
          onResendOtp={handleResendOtp}
          onBack={() => setVerificationStep(false)}
        />
      )}
    </>
  );
}
