
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";

export default function Discussions() {
  const { data: discussions, isLoading } = useQuery({
    queryKey: ['discussions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discussions')
        .select('*, profiles(username)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Discussions</h1>
          <Button>New Discussion</Button>
        </div>
        
        {isLoading ? (
          <div>Loading discussions...</div>
        ) : (
          <div className="space-y-4">
            {discussions?.map((discussion) => (
              <div key={discussion.id} className="bg-card p-4 rounded-lg border">
                <h2 className="text-xl font-semibold">{discussion.title}</h2>
                <p className="text-muted-foreground mt-2">{discussion.content}</p>
                <div className="flex items-center gap-4 mt-4">
                  <Button variant="ghost" size="sm">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Reply
                  </Button>
                  <Button variant="ghost" size="sm">
                    <ThumbsUp className="mr-2 h-4 w-4" />
                    {discussion.votes || 0}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
