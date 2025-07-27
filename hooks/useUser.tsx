// src/hooks/useUser.ts
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { User } from "@/interfaces/interfaces";

export function useUser(userId: number) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchUser() {
      setLoading(true);
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching user:", error.message);
      } else if (isMounted) {
        setUser(data);
      }

      if (isMounted) setLoading(false);
    }

    if (userId) {
      fetchUser();
    } else {
      setLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [userId]);

  return { user, loading };
}
