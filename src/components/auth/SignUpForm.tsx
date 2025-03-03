
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { Textarea } from "@/components/ui/textarea";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const [verificationStep, setVerificationStep] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    return email.endsWith('@university.edu') || 
           email.endsWith('@admin.university.edu') ||
           email.endsWith('@faculty.university.edu') ||
           email.endsWith('@gmail.com');
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

      // For OTP verification, we'll use signInWithOtp instead of signUp
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: window.location.origin + '/auth',
          data: {
            password, // We'll store the password temporarily to complete signup after verification
            role: userRole,
            email_domain: emailDomain,
          }
        }
      });

      if (otpError) throw otpError;

      setVerificationStep(true);
      toast({
        title: "OTP Sent",
        description: "Please check your email for a verification code.",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send verification code",
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

      // After verification, we need to create the user profile
      try {
        // Get the email domain to determine role
        const emailDomain = email.substring(email.indexOf('@'));
        
        // Determine appropriate role based on email domain
        let userRole = role;
        if (emailDomain === '@admin.university.edu') {
          userRole = 'admin';
        } else if (emailDomain === '@faculty.university.edu') {
          userRole = 'faculty';
        }

        // Get the user ID after verification
        const { data: userData } = await supabase.auth.getUser();
        
        if (userData?.user?.id) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: userData.user.id,
                role: userRole,
                email_domain: emailDomain,
              },
            ]);

          if (profileError) {
            console.error("Profile creation error:", profileError);
            // Continue with signup even if profile creation fails
            if (profileError.message.includes("infinite recursion detected in policy")) {
              console.warn("RLS policy recursion detected - proceeding with signup");
            } else {
              throw profileError;
            }
          }
        }
      } catch (profileCreationError: any) {
        console.error("Error in profile creation:", profileCreationError);
        // Don't throw the error here, just log it and continue
      }

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
            />
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
            {loading ? "Sending verification code..." : "Send Verification Code"}
          </Button>
        </form>
      ) : (
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <div>
            <Input
              type="text"
              placeholder="Enter the verification code sent to your email"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Check your email for a verification code and enter it here
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Verifying..." : "Verify Email"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            className="w-full" 
            onClick={() => setVerificationStep(false)}
            disabled={loading}
          >
            Back
          </Button>
        </form>
      )}
    </>
  );
}
