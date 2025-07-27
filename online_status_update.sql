ALTER TABLE users
  ADD COLUMN status_preference TEXT NOT NULL DEFAULT 'online',
  ADD CONSTRAINT status_preference_check
    CHECK (status_preference IN ('online','dnd'));

ALTER TABLE users
  ADD COLUMN last_active TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE accounts
ADD COLUMN last_active_user_id INTEGER;

ALTER TABLE accounts
ADD CONSTRAINT fk_accounts_last_active_user
  FOREIGN KEY (last_active_user_id)
  REFERENCES users(id)
  ON DELETE SET NULL;