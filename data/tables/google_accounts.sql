CREATE TABLE IF NOT EXISTS google_accounts (
  "id" uuid PRIMARY KEY NOT NULL DEFAULT gen_random_uuid(),
  "username" varchar UNIQUE NOT NULL,
  "full_name" varchar NOT NULL,
  "email" varchar NOT NULL,
  "token" varchar NOT NULL,
  "expired" timestamp NOT NULL,
  "created_at" timestamp NOT NULL DEFAULT now(),
  "updated_at" timestamp NOT NULL DEFAULT now()
);
CREATE UNIQUE INDEX IF NOT EXISTS "google_accounts_username_idx" ON google_accounts ("username");
CREATE INDEX IF NOT EXISTS "google_accounts_email_idx" ON google_accounts ("email");
GRANT SELECT ON google_accounts TO "authenticated" WITH CHECK (true);
GRANT INSERT ON google_accounts TO "authenticated" WITH CHECK (true);
GRANT UPDATE ON google_accounts TO "authenticated" WITH CHECK (auth.uid() = id);
GRANT DELETE ON google_accounts TO "authenticated" WITH CHECK (auth.uid() = id);