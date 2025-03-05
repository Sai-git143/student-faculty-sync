
import React from "react";

export function AnnouncementsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-muted rounded-lg p-3">
          <div className="h-4 bg-muted-foreground/20 rounded w-1/4 mb-2"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-3/4 mb-1"></div>
          <div className="h-3 bg-muted-foreground/20 rounded w-1/2"></div>
        </div>
      ))}
    </div>
  );
}
