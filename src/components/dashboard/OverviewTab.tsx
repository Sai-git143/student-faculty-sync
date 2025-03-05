import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Book, 
  Zap,
  CheckCircle2
} from "lucide-react";
import { RealtimeAnnouncements } from "@/components/announcements/RealtimeAnnouncements";

export function OverviewTab() {
  return (
    <div className="space-y-4">
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
        
        <TasksDeadlinesCard />
      </div>
    </div>
  );
}

function TasksDeadlinesCard() {
  return (
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
  );
}
