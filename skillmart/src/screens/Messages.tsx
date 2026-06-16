import { MessageCircle, Send } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { useApp } from "../context/AppContext";
import type { Message } from "../types";

function threadKey(message: Message) {
  return `${message.productId}:${message.buyerId}:${message.sellerId}`;
}

export function Messages() {
  const { user, messages, selectedThread, openThread, sendThreadMessage } = useApp();
  const [draft, setDraft] = useState("");

  const threads = useMemo(() => {
    const seen = new Map<string, Message>();
    messages.forEach((message) => {
      const key = threadKey(message);
      const current = seen.get(key);
      if (!current || new Date(message.createdAt) > new Date(current.createdAt)) {
        seen.set(key, message);
      }
    });
    return [...seen.values()].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [messages]);

  const active = selectedThread ?? threads[0] ?? null;
  const activeMessages = active
    ? messages
        .filter((message) => threadKey(message) === threadKey(active))
        .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    : [];

  const submit = async () => {
    if (!draft.trim()) return;
    try {
      await sendThreadMessage(draft.trim());
      setDraft("");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Message could not be sent.");
    }
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8 pb-16">
      <div className="mb-6">
        <h1 className="text-2xl font-extrabold">Messages</h1>
        <p className="text-[var(--muted-fg)] text-sm mt-0.5">Talk to buyers and sellers without paid chat tools.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[320px,1fr] gap-4">
        <aside className="card overflow-hidden">
          {threads.length === 0 ? (
            <div className="p-8 text-center text-[var(--muted-fg)]">
              <MessageCircle size={34} className="mx-auto mb-3 opacity-40" />
              <p className="font-semibold">No conversations yet</p>
              <p className="text-xs mt-1">Open a hire listing to start one.</p>
            </div>
          ) : (
            threads.map((thread) => {
              const otherName = thread.buyerId === user?.id ? thread.sellerName : thread.buyerName;
              const activeThread = active && threadKey(active) === threadKey(thread);
              return (
                <button
                  key={threadKey(thread)}
                  onClick={() => openThread(thread)}
                  className={`w-full text-left p-4 border-b border-[var(--border)] transition-colors ${activeThread ? "bg-[var(--accent)]" : "hover:bg-[var(--secondary)]"}`}
                >
                  <div className="font-semibold text-sm line-clamp-1">{otherName ?? "SkillMart user"}</div>
                  <div className="text-xs text-[var(--muted-fg)] line-clamp-1">{thread.productTitle}</div>
                  <div className="text-xs text-[var(--muted-fg)] line-clamp-1 mt-1">{thread.body}</div>
                </button>
              );
            })
          )}
        </aside>

        <section className="card min-h-[520px] flex flex-col overflow-hidden">
          {active ? (
            <>
              <div className="p-4 border-b border-[var(--border)]">
                <div className="font-bold">{active.productTitle}</div>
                <div className="text-xs text-[var(--muted-fg)]">
                  {active.buyerName} and {active.sellerName}
                </div>
              </div>

              <div className="flex-1 p-4 flex flex-col gap-3 overflow-y-auto">
                {activeMessages.map((message) => {
                  const mine = message.senderId === user?.id;
                  return (
                    <div key={message.id} className={`max-w-[78%] rounded-xl px-4 py-2 text-sm ${mine ? "self-end bg-[var(--primary)] text-white" : "self-start bg-[var(--secondary)]"}`}>
                      <p>{message.body}</p>
                      <p className={`text-[10px] mt-1 ${mine ? "text-white/70" : "text-[var(--muted-fg)]"}`}>
                        {new Date(message.createdAt).toLocaleString()}
                      </p>
                    </div>
                  );
                })}
              </div>

              <div className="p-4 border-t border-[var(--border)] flex gap-2">
                <input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") submit(); }}
                  placeholder="Type your message..."
                  className="input"
                />
                <button onClick={submit} className="btn-primary px-4 flex items-center gap-2">
                  <Send size={15} /> Send
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-center text-[var(--muted-fg)] p-8">
              <div>
                <MessageCircle size={40} className="mx-auto mb-3 opacity-40" />
                <p className="font-semibold">Select a conversation</p>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
