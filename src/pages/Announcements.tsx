
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

export default function Announcements() {
  const { data: announcements, isLoading } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('announcements')
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
          <h1 className="text-3xl font-bold">Announcements</h1>
          <Button>New Announcement</Button>
        </div>
        
        {isLoading ? (
          <div>Loading announcements...</div>
        ) : (
          <div className="space-y-4">
            {announcements?.map((announcement) => (
              <div key={announcement.id} className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold">{announcement.title}</h2>
                <p className="text-muted-foreground mt-2">{announcement.content}</p>
                <div className="mt-4 text-sm text-muted-foreground">
                  Posted {formatDistanceToNow(new Date(announcement.created_at))} ago
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
