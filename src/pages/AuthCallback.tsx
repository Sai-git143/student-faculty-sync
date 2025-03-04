
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }

        if (data?.session) {
          // Successfully authenticated
          toast({
            title: "Success",
            description: "You have been signed in successfully.",
          });
          
          // Check if user profile exists, if not create it
          try {
            const { data: userData } = await supabase.auth.getUser();
            
            if (userData?.user) {
              const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', userData.user.id)
                .single();
                
              // If profile doesn't exist, create it
              if (profileError && profileError.code === 'PGRST116') {
                const { error: createProfileError } = await supabase
                  .from('profiles')
                  .insert([
                    {
                      id: userData.user.id,
                      email_domain: userData.user.email ? userData.user.email.substring(userData.user.email.indexOf('@')) : '',
                      role: userData.user.email?.endsWith('@admin.university.edu') 
                        ? 'admin' 
                        : userData.user.email?.endsWith('@faculty.university.edu') 
                          ? 'faculty' 
                          : 'student'
                    },
                  ]);
                
                if (createProfileError && !createProfileError.message.includes("infinite recursion detected")) {
                  console.error("Error creating profile:", createProfileError);
                }
              }
            }
          } catch (profileError) {
            console.error("Profile check error:", profileError);
            // Continue even if profile creation fails
          }
          
          navigate("/");
        } else {
          // No session but no error either - this is unusual
          toast({
            title: "Authentication Incomplete",
            description: "Please try signing in again.",
            variant: "destructive",
          });
          navigate("/auth");
        }
      } catch (error: any) {
        console.error("Auth callback error:", error);
        toast({
          title: "Authentication Error",
          description: error.message || "Something went wrong during authentication.",
          variant: "destructive",
        });
        navigate("/auth");
      } finally {
        setLoading(false);
      }
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Completing authentication...</h2>
          {loading ? (
            <div className="flex justify-center items-center gap-2 text-primary">
              <Loader2 className="h-5 w-5 animate-spin" />
              <p>Please wait while we complete the authentication process.</p>
            </div>
          ) : (
            <p className="text-muted-foreground">Redirecting you to the application...</p>
          )}
        </div>
      </div>
    </Layout>
  );
}
