
import { Layout } from "@/components/Layout";
import { ChatBot } from "@/components/ChatBot";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";

export default function Index() {
  const navigate = useNavigate();
  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto mt-12 text-center">
        <h1 className="text-4xl font-bold mb-6">Welcome to University Portal</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Connect, learn, and grow with your university community
        </p>

        {!session ? (
          <div className="space-x-4">
            <Button onClick={() => navigate("/auth")}>Sign In</Button>
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Create Account
            </Button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            <Button onClick={() => navigate("/discussions")}>
              Join Discussions
            </Button>
            <Button onClick={() => navigate("/events")}>
              Browse Events
            </Button>
            <Button onClick={() => navigate("/clubs")}>
              Explore Clubs
            </Button>
            <Button onClick={() => navigate("/career")}>
              Career Opportunities
            </Button>
          </div>
        )}
      </div>
      <ChatBot />
    </Layout>
  );
}
