
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Users } from "lucide-react";

export default function Clubs() {
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

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Clubs</h1>
          <Button>Create Club</Button>
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
                <Button className="mt-4 w-full" variant="secondary">View Club</Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
