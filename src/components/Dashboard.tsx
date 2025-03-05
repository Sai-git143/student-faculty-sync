
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GamificationSystem } from "@/components/gamification/GamificationSystem";
import { OverviewTab } from "@/components/dashboard/OverviewTab";
import { UpcomingTab } from "@/components/dashboard/UpcomingTab";
import { ActivityTab } from "@/components/dashboard/ActivityTab";
import { ClubsSidebar } from "@/components/dashboard/ClubsSidebar";

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
            
            <TabsContent value="overview">
              <OverviewTab />
            </TabsContent>
            
            <TabsContent value="upcoming">
              <UpcomingTab />
            </TabsContent>
            
            <TabsContent value="activity">
              <ActivityTab />
            </TabsContent>
          </Tabs>
        </div>
        
        <div className="md:w-1/4 space-y-6">
          <GamificationSystem userId={userId} />
          <ClubsSidebar />
        </div>
      </div>
    </div>
  );
}
