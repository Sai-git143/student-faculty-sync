
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Clock } from "lucide-react";
import { format } from "date-fns";

export default function Events() {
  const { data: events, isLoading } = useQuery({
    queryKey: ['events'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_time', { ascending: true });
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Events</h1>
          <Button>Create Event</Button>
        </div>
        
        {isLoading ? (
          <div>Loading events...</div>
        ) : (
          <div className="grid gap-6">
            {events?.map((event) => (
              <div key={event.id} className="bg-card p-6 rounded-lg border">
                <h2 className="text-xl font-semibold">{event.title}</h2>
                <p className="text-muted-foreground mt-2">{event.description}</p>
                <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4" />
                    {format(new Date(event.start_time), 'PPP')}
                  </div>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4" />
                    {format(new Date(event.start_time), 'p')}
                  </div>
                  {event.location && (
                    <div className="flex items-center">
                      <MapPin className="mr-2 h-4 w-4" />
                      {event.location}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
