
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";

export function TasksDeadlinesCard() {
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
