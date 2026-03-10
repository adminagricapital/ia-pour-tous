import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Send, ArrowLeft, MessageSquare, User } from "lucide-react";

const Messages = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [userId, setUserId] = useState<string>("");
  const [isAdmin, setIsAdmin] = useState(false);
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMsg, setNewMsg] = useState("");
  const [loading, setLoading] = useState(true);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  const scrollRef = useRef<HTMLDivElement>(null);
  const [adminId, setAdminId] = useState<string>("");

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      setUserId(user.id);

      const { data: roles } = await supabase.from("user_roles").select("role").eq("user_id", user.id);
      const admin = roles?.some(r => r.role === "admin") || false;
      setIsAdmin(admin);

      // Get admin user id for non-admin users
      const { data: adminRoles } = await supabase.from("user_roles").select("user_id").eq("role", "admin").limit(1);
      if (adminRoles?.[0]) setAdminId(adminRoles[0].user_id);

      if (admin) {
        // Admin sees all conversations
        const { data: msgs } = await supabase.from("messages").select("*").order("created_at", { ascending: false });
        const userIds = new Set<string>();
        (msgs || []).forEach((m: any) => { userIds.add(m.sender_id); userIds.add(m.receiver_id); });
        userIds.delete(user.id);

        const { data: profs } = await supabase.from("profiles").select("user_id, full_name");
        const profMap: Record<string, string> = {};
        (profs || []).forEach((p: any) => { profMap[p.user_id] = p.full_name || "Utilisateur"; });
        setProfiles(profMap);

        setConversations(Array.from(userIds).map(uid => ({
          userId: uid,
          name: profMap[uid] || "Utilisateur",
          lastMsg: (msgs || []).find((m: any) => m.sender_id === uid || m.receiver_id === uid),
        })));
      } else {
        // Regular user talks to admin
        if (adminRoles?.[0]) setSelectedUser(adminRoles[0].user_id);
      }
      setLoading(false);
    };
    init();
  }, [navigate]);

  useEffect(() => {
    if (!selectedUser || !userId) return;
    const fetchMessages = async () => {
      const { data } = await supabase.from("messages").select("*")
        .or(`and(sender_id.eq.${userId},receiver_id.eq.${selectedUser}),and(sender_id.eq.${selectedUser},receiver_id.eq.${userId})`)
        .order("created_at", { ascending: true });
      setMessages(data || []);

      // Mark as read
      await supabase.from("messages").update({ is_read: true } as any)
        .eq("receiver_id", userId).eq("sender_id", selectedUser).eq("is_read", false);
    };
    fetchMessages();

    const channel = supabase.channel(`msgs-${userId}-${selectedUser}`)
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "messages" }, (payload) => {
        const msg = payload.new as any;
        if ((msg.sender_id === selectedUser && msg.receiver_id === userId) ||
            (msg.sender_id === userId && msg.receiver_id === selectedUser)) {
          setMessages(prev => [...prev, msg]);
          if (msg.receiver_id === userId) {
            supabase.from("messages").update({ is_read: true } as any).eq("id", msg.id);
          }
        }
      }).subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [selectedUser, userId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!newMsg.trim() || !selectedUser) return;
    await supabase.from("messages").insert({ sender_id: userId, receiver_id: selectedUser, content: newMsg.trim() } as any);
    setNewMsg("");
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="border-b border-border bg-card shrink-0">
        <div className="container mx-auto px-4 py-3 flex items-center gap-3">
          <Link to={isAdmin ? "/admin" : "/dashboard"}><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
          <MessageSquare className="h-5 w-5 text-primary" />
          <h1 className="font-display text-base font-bold text-foreground">Messagerie</h1>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {isAdmin && (
          <div className="w-72 border-r border-border bg-card overflow-y-auto shrink-0 hidden sm:block">
            <div className="p-3">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Conversations</h3>
              {conversations.length === 0 ? (
                <p className="text-xs text-muted-foreground p-3">Aucune conversation</p>
              ) : (
                conversations.map(c => (
                  <button key={c.userId} onClick={() => setSelectedUser(c.userId)}
                    className={`w-full text-left p-3 rounded-lg mb-1 transition-colors ${selectedUser === c.userId ? "bg-primary/10" : "hover:bg-muted"}`}>
                    <div className="flex items-center gap-2">
                      <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{c.lastMsg?.content?.slice(0, 40)}</p>
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <div className="flex-1 flex flex-col">
          {!selectedUser ? (
            <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
              Sélectionnez une conversation
            </div>
          ) : (
            <>
              <div className="p-3 border-b border-border bg-card sm:hidden">
                {isAdmin && (
                  <select className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    value={selectedUser} onChange={e => setSelectedUser(e.target.value)}>
                    {conversations.map(c => <option key={c.userId} value={c.userId}>{c.name}</option>)}
                  </select>
                )}
              </div>
              <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.sender_id === userId ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm ${
                      msg.sender_id === userId
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-muted text-foreground rounded-bl-sm"
                    }`}>
                      {msg.content}
                      <div className={`text-[10px] mt-1 ${msg.sender_id === userId ? "text-primary-foreground/60" : "text-muted-foreground"}`}>
                        {new Date(msg.created_at).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="p-3 border-t border-border bg-card">
                <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-2">
                  <Input value={newMsg} onChange={e => setNewMsg(e.target.value)} placeholder="Votre message..." className="flex-1" />
                  <Button type="submit" size="icon" className="gradient-primary border-0 text-primary-foreground shrink-0">
                    <Send className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;
