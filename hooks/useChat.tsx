// hooks/useChat.ts
import { useState, useEffect, useCallback, useRef } from "react";
import { supabase } from "@/lib/supabase";
import { useActiveUser } from "@/contexts/ActiveUserContext";
import { ChatMessage } from "@/interfaces/interfaces";
import { useIsFocused } from "@react-navigation/native";

export function useChat(friendId: number) {
  const { activeUser } = useActiveUser();
  const isFocused = useIsFocused();
  const focusedRef = useRef(isFocused);
  useEffect(() => {
    focusedRef.current = isFocused;
  }, [isFocused]);

  const [messages, setMessages] = useState<ChatMessage[]>([]);

  useEffect(() => {
    if (!activeUser || !isFocused) return;
    supabase
      .from("messages")
      .update({ is_read: true })
      .eq("sender_id", friendId)
      .eq("recipient_id", activeUser.id)
      .eq("is_read", false)
      .then(({ error }) => {
        if (error) console.error("Mark‑read on focus error:", error);
      });
  }, [activeUser, friendId, isFocused]);

  useEffect(() => {
    if (!activeUser) return;
    const uid = activeUser.id;

    (async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(
          `and(sender_id.eq.${uid},recipient_id.eq.${friendId}),and(sender_id.eq.${friendId},recipient_id.eq.${uid})`
        )
        .order("inserted_at", { ascending: true });

      if (error) {
        console.error("Error fetching messages:", error);
      } else {
        setMessages(data ?? []);
      }
    })();

    const channel = supabase
      .channel(`chat-${uid}-${friendId}`)
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "messages" },
        async ({ new: msg }) => {
          setMessages((prev) =>
            prev.some((m) => m.id === msg.id)
              ? prev
              : [...prev, msg as ChatMessage]
          );

          if (
            focusedRef.current &&
            (msg as ChatMessage).sender_id === friendId &&
            (msg as ChatMessage).recipient_id === uid
          ) {
            const { error } = await supabase
              .from("messages")
              .update({ is_read: true })
              .eq("id", (msg as ChatMessage).id);
            if (error) console.error("Error marking read on receive:", error);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeUser, friendId]);

  const sendMessage = useCallback(
    async (content: string) => {
      const text = content.trim();
      if (!activeUser || !text) return;

      const { error } = await supabase.from("messages").insert({
        sender_id: activeUser.id,
        recipient_id: friendId,
        content: text,
      });
      if (error) console.error("Error sending message:", error);
    },
    [activeUser, friendId]
  );

  return { messages, sendMessage };
}
