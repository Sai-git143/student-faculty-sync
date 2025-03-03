
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp, Plus } from "lucide-react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
  DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

export default function Discussions() {
  const [newDiscussion, setNewDiscussion] = useState({
    title: "",
    content: "",
    category: "general"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: discussions, isLoading } = useQuery({
    queryKey: ['discussions'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('discussions')
        .select('*, profiles(username, avatar_url)')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  const { data: session } = useQuery({
    queryKey: ['session'],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      return session;
    },
  });

  const createDiscussionMutation = useMutation({
    mutationFn: async (discussionData: typeof newDiscussion) => {
      const { data, error } = await supabase
        .from('discussions')
        .insert([{
          ...discussionData,
          author_id: session?.user.id
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
      toast({
        title: "Success",
        description: "Your discussion has been created.",
      });
      setNewDiscussion({
        title: "",
        content: "",
        category: "general"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create discussion",
        variant: "destructive",
      });
    }
  });

  const voteDiscussionMutation = useMutation({
    mutationFn: async ({ id, votes }: { id: string; votes: number }) => {
      const { data, error } = await supabase
        .from('discussions')
        .update({ votes: votes + 1 })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['discussions'] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to vote on discussion",
        variant: "destructive",
      });
    }
  });

  const handleCreateDiscussion = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a discussion.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newDiscussion.title.trim() || !newDiscussion.content.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide both a title and content for your discussion.",
        variant: "destructive",
      });
      return;
    }
    
    createDiscussionMutation.mutate(newDiscussion);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Discussions</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Discussion
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Discussion</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <Input
                    placeholder="Discussion Title"
                    value={newDiscussion.title}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Share your thoughts..."
                    value={newDiscussion.content}
                    onChange={(e) => setNewDiscussion(prev => ({ ...prev, content: e.target.value }))}
                    rows={5}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateDiscussion} disabled={createDiscussionMutation.isPending}>
                  {createDiscussionMutation.isPending ? "Creating..." : "Post Discussion"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => voteDiscussionMutation.mutate({ id: discussion.id, votes: discussion.votes || 0 })}
                  >
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
