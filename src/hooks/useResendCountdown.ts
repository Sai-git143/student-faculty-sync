
import { useState, useCallback, useEffect } from "react";

export function useResendCountdown(initialCountdown = 60) {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const startResendCountdown = useCallback(() => {
    setResendDisabled(true);
    setCountdown(initialCountdown);
  }, [initialCountdown]);

  useEffect(() => {
    if (countdown <= 0) return;
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setResendDisabled(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [countdown]);

  return {
    resendDisabled,
    countdown,
    startResendCountdown
  };
}
