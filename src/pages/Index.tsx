
import { Layout } from "@/components/Layout";
import { ChatBot } from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Dashboard } from "@/components/Dashboard";
import { useState, useEffect } from "react";
import { Loader2 } from "lucide-react";

export default function Index() {
  const navigate = useNavigate();
  const [authChecking, setAuthChecking] = useState(true);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  // First, check authentication state - this runs immediately without network requests
  useEffect(() => {
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();
      setCurrentUserId(data.session?.user.id || null);
      setAuthChecking(false);
    };
    
    checkAuth();
    
    // Also set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setCurrentUserId(session?.user.id || null);
      }
    );
    
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Only fetch profile data if user is authenticated
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', currentUserId],
    queryFn: async () => {
      if (!currentUserId) return null;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUserId)
          .maybeSingle();
          
        if (error) throw error;
        return data;
      } catch (error) {
        console.error("Error fetching user profile:", error);
        return null;
      }
    },
    enabled: !!currentUserId,
    staleTime: 60000, // Cache for 1 minute to prevent excessive refetching
  });

  // Show initial loading only while checking auth
  if (authChecking) {
    return (
      <Layout>
        <div className="h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">Loading application...</p>
          </div>
        </div>
      </Layout>
    );
  }

  // If not authenticated, show welcome screen
  if (!currentUserId) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto mt-12 text-center">
          <h1 className="text-4xl font-bold mb-6">Welcome to University Portal</h1>
          <p className="text-xl text-muted-foreground mb-8">
            Connect, learn, and grow with your university community
          </p>
          <div className="space-x-4">
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Create Account
            </Button>
          </div>
        </div>
        <ChatBot />
      </Layout>
    );
  }

  // For authenticated users, show dashboard
  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-6">
        {profileLoading ? (
          <div className="flex justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <Dashboard userProfile={userProfile} />
        )}
      </div>
      <ChatBot />
    </Layout>
  );
}
