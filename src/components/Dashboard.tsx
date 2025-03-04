
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, Users, BookOpen, Bell, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Event {
  id: string;
  title: string;
  date: string;
  status: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  timestamp: string;
}

export function Dashboard({ userProfile }: { userProfile: any }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock data for demonstration
  const upcomingEvents: Event[] = [
    { id: "1", title: "Science Fair", date: "2023-10-15", status: "upcoming" },
    { id: "2", title: "Alumni Meetup", date: "2023-10-20", status: "upcoming" },
    { id: "3", title: "Career Workshop", date: "2023-11-05", status: "upcoming" }
  ];
  
  const recentActivities: Activity[] = [
    { id: "1", type: "discussion", title: "New post in Computer Science forum", timestamp: "2 hours ago" },
    { id: "2", type: "announcement", title: "Exam dates announced", timestamp: "1 day ago" },
    { id: "3", type: "club", title: "Chess Club meeting rescheduled", timestamp: "2 days ago" }
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-primary/10 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-2">
          Welcome back, {userProfile?.full_name || userProfile?.username || 'University Member'}
        </h2>
        <p className="text-muted-foreground mb-4">
          Here's what's happening in your university community today
        </p>
        <div className="flex flex-wrap gap-3">
          <Badge variant="outline" className="bg-background/80">
            <span className="text-primary font-medium">{userProfile?.role || 'Student'}</span>
          </Badge>
          {userProfile?.department && (
            <Badge variant="outline" className="bg-background/80">
              {userProfile.department}
            </Badge>
          )}
          {userProfile?.year && (
            <Badge variant="outline" className="bg-background/80">
              Year {userProfile.year}
            </Badge>
          )}
        </div>
      </div>

      {/* Main Dashboard Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-3 mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="activities">Recent Activity</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                Upcoming Events
              </CardTitle>
              <CardDescription>Your next events and deadlines</CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingEvents.slice(0, 2).map(event => (
                <div key={event.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{event.title}</p>
                    <p className="text-sm text-muted-foreground">{event.date}</p>
                  </div>
                  <Button variant="outline" size="sm">View</Button>
                </div>
              ))}
              <Button 
                variant="ghost" 
                className="w-full mt-2" 
                size="sm"
                onClick={() => navigate("/events")}
              >
                View all events
              </Button>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Recent Activity
              </CardTitle>
              <CardDescription>Latest updates from your community</CardDescription>
            </CardHeader>
            <CardContent>
              {recentActivities.slice(0, 2).map(activity => (
                <div key={activity.id} className="flex justify-between items-center py-2 border-b last:border-0">
                  <div>
                    <p className="font-medium">{activity.title}</p>
                    <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                  </div>
                  <Badge variant={
                    activity.type === "announcement" ? "destructive" : 
                    activity.type === "discussion" ? "secondary" : 
                    "outline"
                  }>
                    {activity.type}
                  </Badge>
                </div>
              ))}
              <Button 
                variant="ghost" 
                className="w-full mt-2" 
                size="sm"
                onClick={() => setActiveTab("activities")}
              >
                View all activity
              </Button>
            </CardContent>
          </Card>
          
          <Card className="md:col-span-2">
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-primary" />
                Quick Actions
              </CardTitle>
              <CardDescription>Common tasks and actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-4 gap-2"
                  onClick={() => navigate("/discussions")}
                >
                  <Users className="h-6 w-6" />
                  <span>Join Discussions</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-4 gap-2"
                  onClick={() => navigate("/events")}
                >
                  <Calendar className="h-6 w-6" />
                  <span>Browse Events</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-4 gap-2"
                  onClick={() => navigate("/clubs")}
                >
                  <Users className="h-6 w-6" />
                  <span>Explore Clubs</span>
                </Button>
                <Button 
                  variant="outline" 
                  className="h-auto flex-col py-4 gap-2"
                  onClick={() => navigate("/career")}
                >
                  <BookOpen className="h-6 w-6" />
                  <span>Career Resources</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="upcoming">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-primary" />
                All Upcoming Events
              </CardTitle>
              <CardDescription>Your schedule for the coming weeks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {upcomingEvents.map(event => (
                  <div key={event.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">{event.title}</p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>{event.date}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge>
                        {event.status}
                      </Badge>
                      <Button size="sm">Details</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                All Recent Activities
              </CardTitle>
              <CardDescription>Latest updates from your community</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map(activity => (
                  <div key={activity.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.timestamp}</p>
                    </div>
                    <div>
                      <Badge variant={
                        activity.type === "announcement" ? "destructive" : 
                        activity.type === "discussion" ? "secondary" : 
                        "outline"
                      }>
                        {activity.type}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
