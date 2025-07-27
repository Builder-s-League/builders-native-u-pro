// src/hooks/usePresenceHeartbeat.ts
import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useActiveUser } from "@/contexts/ActiveUserContext";

export function usePresenceHeartbeat(intervalMs = 60_000) {
  const { activeUser } = useActiveUser();

  useEffect(() => {
    if (!activeUser) return;

    let mounted = true;
    const tick = async () => {
      if (!mounted) return;
      await supabase
        .from("users")
        .update({ last_active: new Date().toISOString() })
        .eq("id", activeUser.id);
    };

    // initial post
    tick();
    // then every minute
    const iv = setInterval(tick, intervalMs);
    return () => {
      mounted = false;
      clearInterval(iv);
    };
  }, [activeUser, intervalMs]);
}
