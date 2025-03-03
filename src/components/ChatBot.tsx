
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, X, ChevronUp, ChevronDown } from "lucide-react";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  content: string;
  is_bot: boolean;
  created_at: string;
};

export function ChatBot() {
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [expanded, setExpanded] = useState(false);
  const { toast } = useToast();

  // Load previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: true })
        .limit(10);
      
      if (!error && data) {
        setMessages(data as Message[]);
      }
    };

    fetchMessages();
    
    // Subscribe to new messages
    const subscription = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
      
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;

    setLoading(true);
    try {
      // Store user message
      const { data: userData, error: userError } = await supabase
        .from('messages')
        .insert([
          {
            content: message,
            user_id: (await supabase.auth.getUser()).data.user?.id,
            is_bot: false,
          },
        ])
        .select();

      if (userError) throw userError;

      // Simple bot response logic (to be replaced with a function call)
      const botResponse = generateBotResponse(message);
      
      // Store bot response
      await supabase.from('messages').insert([
        {
          content: botResponse,
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

  // Simple bot response generator (can be replaced with a function call)
  const generateBotResponse = (msg: string) => {
    const normalizedMsg = msg.toLowerCase();
    if (normalizedMsg.includes("class") || normalizedMsg.includes("schedule")) {
      return "Class schedules can be found in the student portal under 'My Schedule' tab.";
    } else if (normalizedMsg.includes("event")) {
      return "You can find all university events in the Events page. Check it out!";
    } else if (normalizedMsg.includes("club")) {
      return "There are many clubs to join! Visit the Clubs page to browse and join.";
    } else if (normalizedMsg.includes("discuss") || normalizedMsg.includes("forum")) {
      return "Join our discussion forums to connect with other students and faculty.";
    } else {
      return "I'm here to help with university-related questions. Ask me about classes, events, clubs, or discussions!";
    }
  };

  return (
    <div className="fixed bottom-4 right-4 w-96 bg-card rounded-lg border shadow-lg z-10">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">University Assistant</h2>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronUp className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="icon">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      {expanded && (
        <div className="p-4 max-h-[300px] overflow-y-auto">
          {messages.length > 0 ? (
            messages.map((msg) => (
              <div 
                key={msg.id} 
                className={`mb-2 p-2 rounded-lg ${
                  msg.is_bot 
                    ? "bg-accent/50 ml-4" 
                    : "bg-primary/10 mr-4"
                }`}
              >
                {msg.content}
              </div>
            ))
          ) : (
            <p className="text-muted-foreground text-sm text-center">
              Ask me anything about the university!
            </p>
          )}
        </div>
      )}
      
      <form onSubmit={handleSendMessage} className="p-4 flex gap-2">
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
  );
}
