
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { determineRoleFromEmail } from "@/utils/emailValidation";
import { useToast } from "@/components/ui/use-toast";

export function useUserRegistration() {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const registerUser = async (email: string, password: string, role: string, navigate: any) => {
    setLoading(true);
    
    try {
      console.log("Creating account...");
      
      // Create user with email and password
      const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: determineRoleFromEmail(email, role),
            email_domain: email.substring(email.indexOf('@')),
          }
        }
      });
      
      console.log("Sign up response:", signUpData);
      
      if (signUpError) {
        console.error("Sign up error:", signUpError);
        throw signUpError;
      }
      
      toast({
        title: "Account Created",
        description: "Your account has been created successfully. You are now signed in.",
      });
      
      navigate("/");
      return true;
    } catch (error: any) {
      const errorMsg = error.message || "Failed to create account";
      toast({
        title: "Registration Error",
        description: errorMsg,
        variant: "destructive",
      });
      console.error("Registration process error:", error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    registerUser
  };
}
