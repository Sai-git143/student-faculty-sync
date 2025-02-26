
import { Layout } from "@/components/Layout";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Building, GraduationCap, Linkedin } from "lucide-react";

export default function Alumni() {
  const { data: alumniProfiles, isLoading } = useQuery({
    queryKey: ['alumni-profiles'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('alumni_profiles')
        .select('*, profiles(*)')
        .order('graduation_year', { ascending: false });
      if (error) throw error;
      return data;
    }
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Alumni Network</h1>
          <Button>Update Profile</Button>
        </div>
        
        {isLoading ? (
          <div>Loading alumni profiles...</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {alumniProfiles?.map((alumni) => (
              <div key={alumni.id} className="bg-card p-6 rounded-lg border">
                <div className="flex items-start gap-4">
                  {alumni.profiles?.avatar_url ? (
                    <img
                      src={alumni.profiles.avatar_url}
                      alt={alumni.profiles.full_name}
                      className="w-16 h-16 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                      <GraduationCap className="w-8 h-8 text-accent" />
                    </div>
                  )}
                  <div>
                    <h2 className="text-xl font-semibold">{alumni.profiles?.full_name}</h2>
                    <div className="text-sm text-muted-foreground space-y-1 mt-1">
                      <div className="flex items-center gap-2">
                        <GraduationCap className="h-4 w-4" />
                        {alumni.degree} in {alumni.major}, {alumni.graduation_year}
                      </div>
                      {alumni.current_company && (
                        <div className="flex items-center gap-2">
                          <Building className="h-4 w-4" />
                          {alumni.current_company}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                {alumni.bio && (
                  <p className="mt-4 text-sm text-muted-foreground">{alumni.bio}</p>
                )}
                {alumni.linkedin_url && (
                  <Button variant="secondary" className="mt-4 w-full" asChild>
                    <a href={alumni.linkedin_url} target="_blank" rel="noopener noreferrer">
                      <Linkedin className="mr-2 h-4 w-4" />
                      Connect on LinkedIn
                    </a>
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
