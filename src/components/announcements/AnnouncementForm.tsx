
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Send } from "lucide-react";

interface AnnouncementFormProps {
  onSubmit: (content: string) => Promise<void>;
  submitting: boolean;
}

export function AnnouncementForm({ onSubmit, submitting }: AnnouncementFormProps) {
  const [newAnnouncement, setNewAnnouncement] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnouncement.trim()) return;
    
    await onSubmit(newAnnouncement);
    setNewAnnouncement("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <Input
        value={newAnnouncement}
        onChange={(e) => setNewAnnouncement(e.target.value)}
        placeholder="Share an announcement with the community..."
        disabled={submitting}
      />
      <Button type="submit" size="sm" disabled={submitting || !newAnnouncement.trim()}>
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
}
