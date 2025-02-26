
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function ChatBot() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Store user message
      await supabase.from('messages').insert([
        {
          content: message,
          user_id: (await supabase.auth.getUser()).data.user?.id,
        },
      ]);

      // Call chatbot function (to be implemented)
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message },
      });

      if (error) throw error;

      // Store bot response
      await supabase.from('messages').insert([
        {
          content: data.response,
          is_bot: true,
        },
      ]);

      setMessage("");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-card rounded-lg border shadow-lg">
      <div className="p-4">
        <h2 className="text-lg font-semibold mb-4">University Assistant</h2>
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask about class timings, events..."
            disabled={loading}
          />
          <Button type="submit" size="icon" disabled={loading}>
            <MessageSquare className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
