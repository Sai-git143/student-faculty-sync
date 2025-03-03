
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { Layout } from "@/components/Layout";
import { useToast } from "@/components/ui/use-toast";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { error } = await supabase.auth.getSession();
      
      if (error) {
        toast({
          title: "Authentication Error",
          description: error.message,
          variant: "destructive",
        });
        navigate("/auth");
        return;
      }

      // Successfully authenticated
      toast({
        title: "Success",
        description: "You have been signed in successfully.",
      });
      navigate("/");
    };

    handleAuthCallback();
  }, [navigate, toast]);

  return (
    <Layout>
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">Completing authentication...</h2>
          <p className="text-muted-foreground">Please wait while we complete the authentication process.</p>
        </div>
      </div>
    </Layout>
  );
}
