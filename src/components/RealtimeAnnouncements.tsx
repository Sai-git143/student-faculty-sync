
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/lib/supabase";
import { Badge } from "@/components/ui/badge";
import { Send, ThumbsUp, MessageSquare, Bell } from "lucide-react";

type Announcement = {
  id: string;
  content: string;
  author: string;
  author_id: string;
  created_at: string;
  likes: number;
  comments: number;
  category: string;
};

export function RealtimeAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();
  const announcementsRef = useRef<HTMLDivElement>(null);

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

  // Auto-scroll when new announcements arrive
  useEffect(() => {
    if (announcementsRef.current) {
      announcementsRef.current.scrollTop = 0;
    }
  }, [announcements.length]);

  const handleSubmitAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    
    setSubmitting(true);
    try {
      // In a real implementation, this would insert to a database
      const mockNewAnnouncement: Announcement = {
        id: `user-${Date.now()}`,
        content: newAnnouncement,
        author: "Current User",
        author_id: "current_user",
        created_at: new Date().toISOString(),
        likes: 0,
        comments: 0,
        category: "community"
      };
      
      setAnnouncements(prev => [mockNewAnnouncement, ...prev]);
      setNewAnnouncement("");
      
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

  // Helper to format relative time
  const getRelativeTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Helper to get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'academic': return 'bg-blue-100 text-blue-800';
      case 'sports': return 'bg-green-100 text-green-800';
      case 'events': return 'bg-purple-100 text-purple-800';
      case 'clubs': return 'bg-yellow-100 text-yellow-800';
      case 'facilities': return 'bg-orange-100 text-orange-800';
      case 'community': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Community Announcements
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmitAnnouncement} className="flex gap-2 mb-4">
          <Input
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Share an announcement with the community..."
            disabled={submitting}
          />
          <Button type="submit" size="sm" disabled={submitting || !newAnnouncement.trim()}>
            <Send className="h-4 w-4" />
          </Button>
        </form>
        
        <div 
          ref={announcementsRef}
          className="space-y-3 max-h-[400px] overflow-y-auto pr-1"
        >
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-muted rounded-lg p-3">
                  <div className="h-4 bg-muted-foreground/20 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-3/4 mb-1"></div>
                  <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : announcements.length > 0 ? (
            announcements.map(announcement => (
              <div 
                key={announcement.id} 
                className="bg-card rounded-lg p-3 border shadow-sm"
              >
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-sm">{announcement.author}</span>
                  <span className="text-xs text-muted-foreground">
                    {getRelativeTime(announcement.created_at)}
                  </span>
                </div>
                
                <p className="text-sm mb-2">{announcement.content}</p>
                
                <div className="flex justify-between items-center">
                  <div className="flex gap-1">
                    <Badge 
                      variant="outline" 
                      className={getCategoryColor(announcement.category)}
                    >
                      {announcement.category}
                    </Badge>
                  </div>
                  
                  <div className="flex gap-3">
                    <button 
                      className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => handleLikeAnnouncement(announcement.id)}
                    >
                      <ThumbsUp className="h-3.5 w-3.5" />
                      <span>{announcement.likes}</span>
                    </button>
                    
                    <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
                      <MessageSquare className="h-3.5 w-3.5" />
                      <span>{announcement.comments}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              <p>No announcements yet</p>
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View All Announcements
        </Button>
      </CardFooter>
    </Card>
  );
}
