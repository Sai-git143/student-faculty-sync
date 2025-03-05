
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart } from "lucide-react";

export function ActivityTab() {
  const activities = [
    { action: "Earned 15 points", detail: "For attending Computer Science workshop", time: "Today, 11:23 AM" },
    { action: "Submitted assignment", detail: "MATH201: Linear Algebra Problem Set", time: "Yesterday, 9:45 PM" },
    { action: "Joined discussion", detail: "Topic: Renewable Energy Solutions", time: "Oct 10, 3:15 PM" },
    { action: "Earned badge", detail: "Academic Excellence: Perfect attendance", time: "Oct 9, 12:00 PM" },
    { action: "RSVP'd to event", detail: "Fall Concert Series: Jazz Night", time: "Oct 8, 5:30 PM" }
  ];

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {activities.map((item, index) => (
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
    </div>
  );
}
