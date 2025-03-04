
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Book, 
  Users, 
  Bell, 
  BarChart, 
  Zap,
  CheckCircle2
} from "lucide-react";
import { GamificationSystem } from "@/components/gamification/GamificationSystem";
import { RealtimeAnnouncements } from "@/components/RealtimeAnnouncements";

export function Dashboard({ userProfile }: { userProfile: any }) {
  const userId = userProfile?.id || '';
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-3/4 space-y-6">
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="activity">Activity</TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Upcoming Events
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">3</div>
                    <p className="text-xs text-muted-foreground">
                      Events this week
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Active Courses
                    </CardTitle>
                    <Book className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">5</div>
                    <p className="text-xs text-muted-foreground">
                      Current semester
                    </p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                      Engagement Points
                    </CardTitle>
                    <Zap className="h-4 w-4 text-muted-foreground" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">324</div>
                    <p className="text-xs text-muted-foreground">
                      Level 3 (74% to Level 4)
                    </p>
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <RealtimeAnnouncements />
                
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="h-5 w-5" />
                      Tasks & Deadlines
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-blue-500"></div>
                          <div>
                            <p className="text-sm font-medium">CS350 Assignment</p>
                            <p className="text-xs text-muted-foreground">Due in 3 days</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-yellow-500"></div>
                          <div>
                            <p className="text-sm font-medium">Biology Presentation</p>
                            <p className="text-xs text-muted-foreground">Due in 1 week</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-red-500"></div>
                          <div>
                            <p className="text-sm font-medium">History Mid-term</p>
                            <p className="text-xs text-muted-foreground">Tomorrow at 10 AM</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-start gap-2">
                          <div className="mt-0.5 h-2 w-2 rounded-full bg-green-500"></div>
                          <div>
                            <p className="text-sm font-medium">Club Meeting</p>
                            <p className="text-xs text-muted-foreground">Today at 4 PM</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="upcoming" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5" />
                    Upcoming Events
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-bold">OCT</div>
                        <div className="text-2xl font-bold">15</div>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold">Career Fair</h4>
                        <p className="text-sm text-muted-foreground mb-1">10:00 AM - 4:00 PM • Student Center</p>
                        <p className="text-sm">Meet representatives from 50+ companies hiring for internships and full-time positions.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-bold">OCT</div>
                        <div className="text-2xl font-bold">18</div>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold">Hackathon Kickoff</h4>
                        <p className="text-sm text-muted-foreground mb-1">6:00 PM - 8:00 PM • Engineering Building</p>
                        <p className="text-sm">Join the 48-hour coding challenge with prizes for the most innovative projects.</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className="text-sm font-bold">OCT</div>
                        <div className="text-2xl font-bold">21</div>
                      </div>
                      <div>
                        <h4 className="text-base font-semibold">Guest Lecture: AI Ethics</h4>
                        <p className="text-sm text-muted-foreground mb-1">2:00 PM - 3:30 PM • Auditorium</p>
                        <p className="text-sm">Distinguished speaker Dr. Emily Chen discusses ethical considerations in artificial intelligence.</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart className="h-5 w-5" />
                    Recent Activity
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { action: "Earned 15 points", detail: "For attending Computer Science workshop", time: "Today, 11:23 AM" },
                      { action: "Submitted assignment", detail: "MATH201: Linear Algebra Problem Set", time: "Yesterday, 9:45 PM" },
                      { action: "Joined discussion", detail: "Topic: Renewable Energy Solutions", time: "Oct 10, 3:15 PM" },
                      { action: "Earned badge", detail: "Academic Excellence: Perfect attendance", time: "Oct 9, 12:00 PM" },
                      { action: "RSVP'd to event", detail: "Fall Concert Series: Jazz Night", time: "Oct 8, 5:30 PM" }
                    ].map((item, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
                        </div>
                        <div>
                          <p className="text-sm font-medium">{item.action}</p>
                          <p className="text-xs text-muted-foreground mb-0.5">{item.detail}</p>
                          <p className="text-xs text-muted-foreground">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:w-1/4 space-y-6">
          <GamificationSystem userId={userId} />
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center gap-2 text-base">
                <Users className="h-4 w-4" />
                Your Clubs
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="text-sm">
                <div className="font-medium">Coding Club</div>
                <div className="text-xs text-muted-foreground">Meeting this Thursday</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Debate Society</div>
                <div className="text-xs text-muted-foreground">Competition next week</div>
              </div>
              <div className="text-sm">
                <div className="font-medium">Photography Club</div>
                <div className="text-xs text-muted-foreground">New exhibition soon</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
