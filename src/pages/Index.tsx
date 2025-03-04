
import { Layout } from "@/components/Layout";
import { ChatBot } from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Dashboard } from "@/components/Dashboard";

export default function Index() {
  const navigate = useNavigate();
  const { data: session, isLoading: sessionLoading } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['userProfile', session?.user.id],
    queryFn: async () => {
      if (!session?.user.id) return null;
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!session?.user.id
  });

  return (
    <Layout>
      <div className="max-w-6xl mx-auto mt-6">
        {sessionLoading || profileLoading ? (
          <div className="text-center p-4">Loading...</div>
        ) : !session ? (
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
        ) : (
          <Dashboard userProfile={userProfile} />
        )}
      </div>
      <ChatBot />
    </Layout>
  );
}
