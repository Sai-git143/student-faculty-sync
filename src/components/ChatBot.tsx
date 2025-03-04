
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { MessageSquare, X, ChevronUp, ChevronDown, Loader2 } from "lucide-react";
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
  const [minimized, setMinimized] = useState(false);
  const { toast } = useToast();
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Load previous messages
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('*')
          .order('created_at', { ascending: true })
          .limit(10);
        
        if (error) throw error;
        
        if (data) {
          setMessages(data as Message[]);
        }
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };

    fetchMessages();
    
    // Subscribe to new messages
    const channel = supabase
      .channel('messages')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, (payload) => {
        setMessages(prev => [...prev, payload.new as Message]);
      })
      .subscribe();
      
    return () => {
      channel.unsubscribe();
    };
  }, []);

  // Auto-scroll to the bottom when new messages come in
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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

      // Call the edge function for AI response instead of local function
      const { data, error } = await supabase.functions.invoke('chatbot', {
        body: { message: message }
      });

      if (error) throw error;

      // Store bot response from edge function
      await supabase.from('messages').insert([
        {
          content: data.response,
          is_bot: true,
        },
      ]);

      setMessage("");
    } catch (error: any) {
      console.error("Chat error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleMinimize = () => {
    setMinimized(!minimized);
    if (minimized) {
      setExpanded(false);
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 ${minimized ? 'w-12 h-12' : 'w-96'} bg-card rounded-lg border shadow-lg z-10 transition-all duration-300`}>
      {minimized ? (
        <Button 
          variant="ghost" 
          className="w-full h-full rounded-full"
          onClick={toggleMinimize}
        >
          <MessageSquare className="h-6 w-6" />
        </Button>
      ) : (
        <>
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
              <Button 
                variant="ghost" 
                size="icon"
                onClick={toggleMinimize}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {expanded && (
            <div 
              ref={chatContainerRef}
              className="p-4 max-h-[300px] overflow-y-auto"
            >
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
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MessageSquare className="h-4 w-4" />
              )}
            </Button>
          </form>
        </>
      )}
    </div>
  );
}
