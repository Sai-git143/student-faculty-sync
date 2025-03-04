
import { useState, useCallback, useEffect } from "react";

export function useResendCountdown(initialCountdown = 60) {
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const startResendCountdown = useCallback((seconds?: number) => {
    setResendDisabled(true);
    setCountdown(seconds || initialCountdown);
    setErrorMessage(null);
  }, [initialCountdown]);

  const setResendError = useCallback((message: string) => {
    setErrorMessage(message);
    // Extract seconds from error message if available (e.g., "...after 56 seconds")
    const secondsMatch = message.match(/after (\d+) seconds/);
    if (secondsMatch && secondsMatch[1]) {
      const seconds = parseInt(secondsMatch[1], 10);
      if (!isNaN(seconds)) {
        startResendCountdown(seconds);
        return;
      }
    }
    // Default fallback
    startResendCountdown();
  }, [startResendCountdown]);

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
    errorMessage,
    startResendCountdown,
    setResendError,
    clearError: () => setErrorMessage(null)
  };
}
