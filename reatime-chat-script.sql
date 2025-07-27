-- 1) Create messages table (with is_read flag)
CREATE TABLE public.messages (
  id            SERIAL        PRIMARY KEY,
  sender_id     INTEGER       NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  recipient_id  INTEGER       NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content       TEXT          NOT NULL,
  is_read       BOOLEAN       NOT NULL DEFAULT FALSE,
  inserted_at   TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 2) Enable Row‑Level Security
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- 3) Policy: allow users to insert their own messages
CREATE POLICY insert_own_message
  ON public.messages
  FOR INSERT
  WITH CHECK (
    sender_id IN (
      SELECT u.id
      FROM public.users u
      JOIN public.accounts a ON u.account_id = a.id
      WHERE a.auth_user_id = auth.uid()
    )
  );

-- 4) Policy: allow users to select messages they send or receive
CREATE POLICY select_own_message
  ON public.messages
  FOR SELECT
  USING (
    sender_id   IN (
      SELECT u.id
      FROM public.users u
      JOIN public.accounts a ON u.account_id = a.id
      WHERE a.auth_user_id = auth.uid()
    )
    OR
    recipient_id IN (
      SELECT u.id
      FROM public.users u
      JOIN public.accounts a ON u.account_id = a.id
      WHERE a.auth_user_id = auth.uid()
    )
  );

-- 5) Policy: allow recipients to mark their messages as read
CREATE POLICY mark_read
  ON public.messages
  FOR UPDATE
  USING (
    recipient_id IN (
      SELECT u.id
      FROM public.users u
      JOIN public.accounts a ON u.account_id = a.id
      WHERE a.auth_user_id = auth.uid()
    )
  )
  WITH CHECK (
    is_read = TRUE
  );

-- 6) Turn on Realtime feature on table "messages"
ALTER TABLE public.messages REPLICA IDENTITY FULL;
ALTER PUBLICATION "supabase_realtime"
  ADD TABLE public.messages;