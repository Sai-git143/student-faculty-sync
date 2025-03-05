
import React, { useRef, useEffect } from "react";
import { Announcement } from "./types";
import { AnnouncementItem } from "./AnnouncementItem";
import { AnnouncementsSkeleton } from "./AnnouncementsSkeleton";

interface AnnouncementsListProps {
  announcements: Announcement[];
  loading: boolean;
  onLike: (id: string) => void;
}

export function AnnouncementsList({ 
  announcements, 
  loading, 
  onLike 
}: AnnouncementsListProps) {
  const announcementsRef = useRef<HTMLDivElement>(null);

  // Auto-scroll when new announcements arrive
  useEffect(() => {
    if (announcementsRef.current) {
      announcementsRef.current.scrollTop = 0;
    }
  }, [announcements.length]);

  return (
    <div 
      ref={announcementsRef}
      className="space-y-3 max-h-[400px] overflow-y-auto pr-1"
    >
      {loading ? (
        <AnnouncementsSkeleton />
      ) : announcements.length > 0 ? (
        announcements.map(announcement => (
          <AnnouncementItem 
            key={announcement.id} 
            announcement={announcement} 
            onLike={onLike} 
          />
        ))
      ) : (
        <div className="text-center py-6 text-muted-foreground">
          <p>No announcements yet</p>
        </div>
      )}
    </div>
  );
}
