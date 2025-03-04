
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Trophy, Award, Star, Zap } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Badge = {
  id: string;
  name: string;
  description: string;
  icon: string;
};

type UserPoints = {
  points: number;
  level: number;
  badges: string[];
};

export function GamificationSystem({ userId }: { userId: string }) {
  const [userPoints, setUserPoints] = useState<UserPoints | null>(null);
  const [availableBadges, setAvailableBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Fetch user points and badges
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) return;
      
      try {
        setLoading(true);
        
        // In a real implementation, this would fetch from a 'user_points' table
        // For demo purposes, we'll generate some sample data
        const mockUserPoints: UserPoints = {
          points: Math.floor(Math.random() * 500) + 50,
          level: Math.floor(Math.random() * 5) + 1,
          badges: ["discussion_starter", "event_attendee"]
        };
        
        setUserPoints(mockUserPoints);
        
        // Mock badges data
        const mockBadges: Badge[] = [
          {
            id: "discussion_starter",
            name: "Discussion Starter",
            description: "Started 5 discussions in the forums",
            icon: "MessageSquare"
          },
          {
            id: "event_attendee",
            name: "Event Enthusiast",
            description: "Attended 10 university events",
            icon: "Calendar"
          },
          {
            id: "top_contributor",
            name: "Top Contributor",
            description: "One of the most active users this month",
            icon: "Trophy"
          },
          {
            id: "academic_achiever",
            name: "Academic Achiever",
            description: "Maintained a high GPA for 2 semesters",
            icon: "GraduationCap"
          }
        ];
        
        setAvailableBadges(mockBadges);
      } catch (error) {
        console.error("Error fetching gamification data:", error);
        toast({
          title: "Error",
          description: "Failed to load engagement data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId, toast]);

  // Calculate level progress
  const calculateProgress = () => {
    if (!userPoints) return 0;
    
    const pointsPerLevel = 100;
    const currentLevelPoints = userPoints.points % pointsPerLevel;
    return (currentLevelPoints / pointsPerLevel) * 100;
  };

  // Render badge icon based on name
  const renderBadgeIcon = (iconName: string) => {
    switch (iconName) {
      case "Trophy":
        return <Trophy className="h-4 w-4" />;
      case "Star":
        return <Star className="h-4 w-4" />;
      case "Award":
        return <Award className="h-4 w-4" />;
      default:
        return <Zap className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-4 space-y-4 animate-pulse">
        <div className="h-4 bg-muted rounded w-3/4"></div>
        <div className="h-8 bg-muted rounded"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="h-12 bg-muted rounded"></div>
          <div className="h-12 bg-muted rounded"></div>
        </div>
      </div>
    );
  }

  if (!userPoints) {
    return (
      <div className="p-4 bg-muted/30 rounded-lg text-center">
        <p>Sign in to see your engagement stats</p>
      </div>
    );
  }

  return (
    <div className="p-4 bg-card rounded-lg border">
      <h3 className="text-lg font-medium mb-3">Your Engagement</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Level {userPoints.level}</span>
          <span className="text-sm font-medium">{userPoints.points} points</span>
        </div>
        
        <Progress value={calculateProgress()} className="h-2" />
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Your Badges</h4>
          <div className="flex flex-wrap gap-2">
            {userPoints.badges.map(badgeId => {
              const badge = availableBadges.find(b => b.id === badgeId);
              return badge ? (
                <Badge 
                  key={badge.id} 
                  variant="secondary"
                  className="flex items-center gap-1 py-1 px-3"
                >
                  {renderBadgeIcon(badge.icon)}
                  <span>{badge.name}</span>
                </Badge>
              ) : null;
            })}
          </div>
        </div>
        
        <div className="pt-2">
          <h4 className="text-sm font-medium mb-2">Earn Points By</h4>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Participating in discussions</li>
            <li>• Attending events</li>
            <li>• Completing your profile</li>
            <li>• Joining clubs and activities</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
