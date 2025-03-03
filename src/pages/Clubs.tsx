
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Users, Plus } from "lucide-react";
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

export default function Clubs() {
  const [newClub, setNewClub] = useState({
    name: "",
    description: "",
    logo_url: ""
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: clubs, isLoading } = useQuery({
    queryKey: ['clubs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('clubs')
        .select('*');
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

  const { data: userProfile } = useQuery({
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

  const createClubMutation = useMutation({
    mutationFn: async (clubData: typeof newClub) => {
      const { data, error } = await supabase
        .from('clubs')
        .insert([{
          ...clubData,
          president_id: session?.user.id
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({
        title: "Success",
        description: "Your club has been created.",
      });
      
      // Add club creator as member with 'president' role
      if (data && data[0]) {
        joinClubMutation.mutate({
          club_id: data[0].id,
          role: 'president'
        });
      }
      
      setNewClub({
        name: "",
        description: "",
        logo_url: ""
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create club",
        variant: "destructive",
      });
    }
  });

  const joinClubMutation = useMutation({
    mutationFn: async ({ club_id, role = 'member' }: { club_id: string, role?: string }) => {
      const { data, error } = await supabase
        .from('club_members')
        .insert([{
          club_id,
          member_id: session?.user.id,
          role
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clubs'] });
      toast({
        title: "Success",
        description: "You have joined the club.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to join club",
        variant: "destructive",
      });
    }
  });

  const handleCreateClub = () => {
    if (!session) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to create a club.",
        variant: "destructive",
      });
      return;
    }
    
    // Check if user is a club coordinator
    if (userProfile?.role !== 'club_coordinator' && userProfile?.role !== 'admin') {
      toast({
        title: "Permission Denied",
        description: "Only club coordinators can create clubs.",
        variant: "destructive",
      });
      return;
    }
    
    if (!newClub.name.trim()) {
      toast({
        title: "Missing Information",
        description: "Please provide a name for your club.",
        variant: "destructive",
      });
      return;
    }
    
    createClubMutation.mutate(newClub);
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clubs</h1>
          
          <Dialog>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Club
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Club</DialogTitle>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Club Name</label>
                  <Input
                    placeholder="Club Name"
                    value={newClub.name}
                    onChange={(e) => setNewClub(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Description</label>
                  <Textarea
                    placeholder="What is this club about?"
                    value={newClub.description}
                    onChange={(e) => setNewClub(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Logo URL (Optional)</label>
                  <Input
                    placeholder="URL to club logo"
                    value={newClub.logo_url}
                    onChange={(e) => setNewClub(prev => ({ ...prev, logo_url: e.target.value }))}
                  />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button onClick={handleCreateClub} disabled={createClubMutation.isPending}>
                  {createClubMutation.isPending ? "Creating..." : "Create Club"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        {isLoading ? (
          <div>Loading clubs...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {clubs?.map((club) => (
              <div key={club.id} className="bg-card p-6 rounded-lg border">
                <div className="flex items-center gap-4">
                  {club.logo_url ? (
                    <img src={club.logo_url} alt={club.name} className="w-16 h-16 rounded-full object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <Users className="w-8 h-8 text-accent" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{club.name}</h2>
                    <p className="text-muted-foreground">{club.description}</p>
                  </div>
                </div>
                <Button 
                  className="mt-4 w-full" 
                  variant="secondary"
                  onClick={() => {
                    if (session) {
                      joinClubMutation.mutate({ club_id: club.id });
                    } else {
                      toast({
                        title: "Authentication Required",
                        description: "Please sign in to join clubs.",
                        variant: "destructive",
                      });
                    }
                  }}
                  disabled={joinClubMutation.isPending}
                >
                  {joinClubMutation.isPending ? "Joining..." : "Join Club"}
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
