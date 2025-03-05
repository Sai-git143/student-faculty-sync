
import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell } from "lucide-react";
import { AnnouncementForm } from "./AnnouncementForm";
import { AnnouncementsList } from "./AnnouncementsList";
import { useAnnouncements } from "./useAnnouncements";

export function RealtimeAnnouncements() {
  const {
    announcements,
    loading,
    submitting,
    handleSubmitAnnouncement,
    handleLikeAnnouncement
  } = useAnnouncements();

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Community Announcements
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <AnnouncementForm 
          onSubmit={handleSubmitAnnouncement}
          submitting={submitting}
        />
        
        <AnnouncementsList
          announcements={announcements}
          loading={loading}
          onLike={handleLikeAnnouncement}
        />
      </CardContent>
      
      <CardFooter className="pt-0">
        <Button variant="ghost" size="sm" className="w-full text-xs">
          View All Announcements
        </Button>
      </CardFooter>
    </Card>
  );
}
