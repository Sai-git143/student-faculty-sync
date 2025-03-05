
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";

export function UpcomingTab() {
  return (
    <div className="space-y-4">
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
    </div>
  );
}
