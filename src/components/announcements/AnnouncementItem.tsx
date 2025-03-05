
import React from "react";
import { Badge } from "@/components/ui/badge";
import { ThumbsUp, MessageSquare } from "lucide-react";
import { Announcement } from "./types";
import { getCategoryColor, getRelativeTime } from "./utils";

interface AnnouncementItemProps {
  announcement: Announcement;
  onLike: (id: string) => void;
}

export function AnnouncementItem({ announcement, onLike }: AnnouncementItemProps) {
  return (
    <div className="bg-card rounded-lg p-3 border shadow-sm">
      <div className="flex justify-between items-start mb-1">
        <span className="font-medium text-sm">{announcement.author}</span>
        <span className="text-xs text-muted-foreground">
          {getRelativeTime(announcement.created_at)}
        </span>
      </div>
      
      <p className="text-sm mb-2">{announcement.content}</p>
      
      <div className="flex justify-between items-center">
        <div className="flex gap-1">
          <Badge 
            variant="outline" 
            className={getCategoryColor(announcement.category)}
          >
            {announcement.category}
          </Badge>
        </div>
        
        <div className="flex gap-3">
          <button 
            className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
            onClick={() => onLike(announcement.id)}
          >
            <ThumbsUp className="h-3.5 w-3.5" />
            <span>{announcement.likes}</span>
          </button>
          
          <button className="text-xs flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>{announcement.comments}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
