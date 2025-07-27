// hooks/useFriendSummaries.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useActiveUser } from "@/contexts/ActiveUserContext";
import type { ChatMessage } from "@/interfaces/interfaces";

export type FriendSummary = {
  latest?: ChatMessage;
  unread: number;
};

export function useFriendSummaries(friendIds: number[]) {
  const { activeUser } = useActiveUser();
  const [summaries, setSummaries] = useState<Record<number, FriendSummary>>({});

  useEffect(() => {
    if (!activeUser || friendIds.length === 0) return;
    const uid = activeUser.id;
    const idList = friendIds.join(",");

    // 1) Initial load: fetch *all* relevant messages, newest first
    supabase
      .from("messages")
      .select("*")
      .or(
        `and(sender_id.eq.${uid},recipient_id.in.(${idList})),and(sender_id.in.(${idList}),recipient_id.eq.${uid}))`
      )
      .order("inserted_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) return console.error("load summaries:", error);

        const map: Record<number, FriendSummary> = {};
        (data || []).forEach((msg) => {
          const other =
            msg.sender_id === uid ? msg.recipient_id : msg.sender_id;

          if (!map[other]) {
            map[other] = { latest: msg as ChatMessage, unread: 0 };
          }

          if (!msg.is_read && msg.recipient_id === uid) {
            map[other].unread += 1;
          }
        });

        setSummaries(map);
      });

    const channel = supabase
      .channel(`friend-summaries-${uid}`)

      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `or(and(sender_id.eq.${uid},recipient_id.in.(${idList})),and(sender_id.in.(${idList}),recipient_id.eq.${uid}))`,
        },
        ({ new: msg }) => {
          const other =
            msg.sender_id === uid ? msg.recipient_id : msg.sender_id;
          setSummaries((prev) => {
            const old = prev[other] || { unread: 0 };
            return {
              ...prev,
              [other]: {
                latest: msg as ChatMessage,
                unread:
                  old.unread +
                  (msg.recipient_id === uid && !msg.is_read ? 1 : 0),
              },
            };
          });
        }
      )

      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "messages",
          filter: `recipient_id.eq.${uid}`,
        },
        ({ new: msg }) => {
          const other =
            msg.sender_id === uid ? msg.recipient_id : msg.sender_id;
          if (msg.is_read) {
            setSummaries((prev) => ({
              ...prev,
              [other]: {
                ...prev[other],

                unread: 0,
              },
            }));
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [activeUser, friendIds]);

  return summaries;
}
