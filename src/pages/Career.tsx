
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Building, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function Career() {
  const { data: careerPosts, isLoading } = useQuery({
    queryKey: ['career-posts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('career_posts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Career Opportunities</h1>
          <Button>Post Job</Button>
        </div>
        
        {isLoading ? (
          <div>Loading opportunities...</div>
        ) : (
          <div className="space-y-4">
            {careerPosts?.map((post) => (
              <div key={post.id} className="bg-card p-6 rounded-lg border">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold">{post.title}</h2>
                    <div className="flex gap-4 mt-2 text-sm text-muted-foreground">
                      <span className="flex items-center">
                        <Building className="mr-2 h-4 w-4" />
                        {post.company}
                      </span>
                      {post.location && (
                        <span className="flex items-center">
                          <MapPin className="mr-2 h-4 w-4" />
                          {post.location}
                        </span>
                      )}
                      {post.deadline && (
                        <span className="flex items-center">
                          <Calendar className="mr-2 h-4 w-4" />
                          Deadline: {format(new Date(post.deadline), 'PP')}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button>Apply Now</Button>
                </div>
                <p className="mt-4">{post.description}</p>
                {post.requirements && (
                  <div className="mt-4">
                    <h3 className="font-semibold">Requirements</h3>
                    <p className="text-muted-foreground">{post.requirements}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
