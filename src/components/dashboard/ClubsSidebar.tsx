
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";

export function ClubsSidebar() {
  return (
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
  );
}
