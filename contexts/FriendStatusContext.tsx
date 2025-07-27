// src/contexts/FriendStatusContext.tsx
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { supabase } from "@/lib/supabase";
import { useActiveUser } from "@/contexts/ActiveUserContext";
import { usePresenceHeartbeat } from "@/hooks/usePresenceHeartbeat";
import type { User } from "@/interfaces/interfaces";

export type Status = "online" | "recently active" | "offline";

interface FriendStatusContextType {
  getStatus: (id: number) => Status;
  onlineCount: number;
}

const FriendStatusContext = createContext<FriendStatusContextType | null>(null);
export function useFriendStatusContext() {
  const ctx = useContext(FriendStatusContext);
  if (!ctx)
    throw new Error(
      "useFriendStatusContext must be used inside FriendStatusProvider"
    );
  return ctx;
}

export const FriendStatusProvider: React.FC<{
  children: ReactNode;
  pollIntervalMs?: number;
}> = ({ children, pollIntervalMs = 60_000 }) => {
  const { activeUser } = useActiveUser();
  const [friendUsers, setFriendUsers] = useState<
    Pick<User, "id" | "last_active">[]
  >([]);
  const [statusMap, setStatusMap] = useState<Record<number, Status>>({});
  const [onlineCount, setOnlineCount] = useState(0);

  // keep activeUser.last_active fresh
  usePresenceHeartbeat(pollIntervalMs);

  useEffect(() => {
    if (!activeUser) {
      setFriendUsers([]);
      setStatusMap({});
      setOnlineCount(0);
      return;
    }

    let mounted = true;
    const fetchAndCompute = async () => {
      // 1) load accepted friendships
      const { data: fr, error: frErr } = await supabase
        .from("friendships")
        .select("requester_id,addressee_id")
        .eq("status", "accepted")
        .or(
          `requester_id.eq.${activeUser.id},addressee_id.eq.${activeUser.id}`
        );
      if (frErr || !mounted) return;

      const ids = fr.map((f: any) =>
        f.requester_id === activeUser.id ? f.addressee_id : f.requester_id
      );
      if (ids.length === 0) {
        setFriendUsers([]);
        setStatusMap({});
        setOnlineCount(0);
        return;
      }

      // 2) fetch their last_active timestamps
      const { data: us, error: usErr } = await supabase
        .from("users")
        .select("id,last_active")
        .in("id", ids);
      if (usErr || !mounted) return;

      setFriendUsers(us);
      // 3) compute statuses
      const now = Date.now();
      const onlineThreshold = 5 * 60_000; // 5 minutes
      const recentThreshold = 30 * 60_000; // 30 minutes
      const map: Record<number, Status> = {};
      us.forEach((u) => {
        const diff = now - new Date(u.last_active).getTime();
        if (diff <= onlineThreshold) map[u.id] = "online";
        else if (diff <= recentThreshold) map[u.id] = "recently active";
        else map[u.id] = "offline";
      });
      console.log("computed statusMap:", map);
      const newOnlineCount = Object.values(map).filter(
        (s) => s === "online"
      ).length;
      console.log("computed onlineCount:", newOnlineCount);
      setStatusMap(map);
      setOnlineCount(newOnlineCount);
    };

    // initial + polling
    fetchAndCompute();
    const iv = setInterval(fetchAndCompute, pollIntervalMs);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [activeUser, pollIntervalMs]);

  return (
    <FriendStatusContext.Provider
      value={{
        getStatus: (id) => statusMap[id] ?? "offline",
        onlineCount,
      }}
    >
      {children}
    </FriendStatusContext.Provider>
  );
};
