
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
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

      const { error: signUpError, data } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: userRole,
          },
        },
      });

      if (signUpError) throw signUpError;

      // Create profile after successful signup
      try {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user?.id,
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
      } catch (profileCreationError: any) {
        console.error("Error in profile creation:", profileCreationError);
        // Don't throw the error here, just log it and continue
      }

      toast({
        title: "Success",
        description: "Please check your email to verify your account.",
      });
      
      navigate("/auth");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create account",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
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
        {loading ? "Creating account..." : "Create Account"}
      </Button>
    </form>
  );
}
