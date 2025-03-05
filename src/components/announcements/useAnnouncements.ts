
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Announcement } from "./types";

export function useAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  // Fetch announcements
  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        // This would fetch from a real 'announcements' table in a complete implementation
        // For demo purposes, we'll generate sample data
        const mockAnnouncements: Announcement[] = [
          {
            id: "1",
            content: "Welcome to the new semester! Check out the updated course catalog.",
            author: "Dean Johnson",
            author_id: "user123",
            created_at: new Date(Date.now() - 3600000).toISOString(),
            likes: 15,
            comments: 3,
            category: "academic"
          },
          {
            id: "2",
            content: "Basketball team tryouts this Friday at 4 PM in the main gym!",
            author: "Coach Williams",
            author_id: "user456",
            created_at: new Date(Date.now() - 7200000).toISOString(),
            likes: 24,
            comments: 7,
            category: "sports"
          },
          {
            id: "3",
            content: "Library will be open 24/7 during final exam week.",
            author: "Library Services",
            author_id: "user789",
            created_at: new Date(Date.now() - 10800000).toISOString(),
            likes: 42,
            comments: 5,
            category: "facilities"
          }
        ];
        
        setAnnouncements(mockAnnouncements);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        toast({
          title: "Error",
          description: "Failed to load announcements",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();
    
    // Set up real-time subscription
    // This would connect to a real channel in a complete implementation
    const interval = setInterval(() => {
      // Simulate receiving a new announcement
      if (Math.random() > 0.8) {
        const categories = ["academic", "sports", "events", "clubs", "facilities"];
        const newMockAnnouncement: Announcement = {
          id: `auto-${Date.now()}`,
          content: `New announcement: ${Math.random().toString(36).substring(2, 15)} ${Math.random().toString(36).substring(2, 15)}`,
          author: "System",
          author_id: "system",
          created_at: new Date().toISOString(),
          likes: 0,
          comments: 0,
          category: categories[Math.floor(Math.random() * categories.length)]
        };
        
        setAnnouncements(prev => [newMockAnnouncement, ...prev]);
        
        toast({
          title: "New Announcement",
          description: "A new announcement has been posted",
        });
      }
    }, 30000); // Every 30 seconds, might simulate a new announcement
    
    return () => {
      clearInterval(interval);
    };
  }, [toast]);

  const handleSubmitAnnouncement = async (content: string) => {
    setSubmitting(true);
    try {
      // In a real implementation, this would insert to a database
      const mockNewAnnouncement: Announcement = {
        id: `user-${Date.now()}`,
        content,
        author: "Current User",
        author_id: "current_user",
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0,
        category: "community"
      };
      
      setAnnouncements(prev => [mockNewAnnouncement, ...prev]);
      
      toast({
        title: "Announcement Posted",
        description: "Your announcement has been shared with the community",
      });
    } catch (error) {
      console.error("Error posting announcement:", error);
      toast({
        title: "Error",
        description: "Failed to post announcement",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleLikeAnnouncement = (id: string) => {
    setAnnouncements(prev => 
      prev.map(announcement => 
        announcement.id === id 
          ? { ...announcement, likes: announcement.likes + 1 } 
          : announcement
      )
    );
  };

  return {
    announcements,
    loading,
    submitting,
    handleSubmitAnnouncement,
    handleLikeAnnouncement
  };
}
