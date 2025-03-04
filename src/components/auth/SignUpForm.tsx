
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [resendDisabled, setResendDisabled] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.endsWith('@university.edu') || 
           email.endsWith('@admin.university.edu') ||
           email.endsWith('@faculty.university.edu') ||
           email.endsWith('@gmail.com');
  };

  const startResendCountdown = () => {
    setResendDisabled(true);
    setCountdown(60);
    
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
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      // Get the email domain
      const emailDomain = email.substring(email.indexOf('@'));
      
      // Determine appropriate role based on email domain
      let userRole = role;
      if (emailDomain === '@admin.university.edu') {
        userRole = 'admin';
      } else if (emailDomain === '@faculty.university.edu') {
        userRole = 'faculty';
      }

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
        return;
      }

      // Send OTP for verification
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
      console.error("OTP send error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendDisabled) return;
    
    setLoading(true);
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
      toast({
        title: "Error",
        description: error.message || "Failed to resend verification code",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

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
      toast({
        title: "Error",
        description: error.message || "Failed to verify account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {!verificationStep ? (
        <form onSubmit={handleSignUp} className="space-y-4">
          <div>
            <Input
              type="email"
              placeholder="Email (@university.edu or @gmail.com)"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Use your university email (@university.edu) or Gmail account (@gmail.com)
            </p>
          </div>
          <div>
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Password must be at least 6 characters
            </p>
          </div>
          <div>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger>
                <SelectValue placeholder="Select your role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="faculty">Faculty</SelectItem>
                <SelectItem value="alumni">Alumni</SelectItem>
                <SelectItem value="club_coordinator">Club Coordinator</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending verification code...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
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
              onClick={() => setVerificationStep(false)}
              disabled={loading}
            >
              Back
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm"
              onClick={handleResendOtp}
              disabled={resendDisabled || loading}
            >
              {resendDisabled 
                ? `Resend code in ${countdown}s` 
                : "Resend code"}
            </Button>
          </div>
        </form>
      )}
    </>
  );
}
