-- Supabase Database Schema Migration: Warscythe V4 Social, Leaderboard & Legion Systems

-- 1. Ensure public.profiles table matches expectations and has email syncing & unique username
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email text;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username text;
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_username_key;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_username_key UNIQUE (username);
CREATE INDEX IF NOT EXISTS profiles_username_idx ON public.profiles (username);

-- Create search index on email for friends search
CREATE INDEX IF NOT EXISTS profiles_email_idx ON public.profiles (email);

-- Auto-sync email from auth.users to public.profiles via Trigger
CREATE OR REPLACE FUNCTION public.handle_profile_user_sync()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, state, updated_at)
  VALUES (new.id, new.email, '{}'::jsonb, now())
  ON CONFLICT (id) DO UPDATE
  SET email = new.email, updated_at = now();
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER sync_auth_users_to_profiles
  AFTER INSERT OR UPDATE OF email ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_profile_user_sync();

-- Sync existing users if profiles exist but email is null
UPDATE public.profiles p
SET email = u.email
FROM auth.users u
WHERE p.id = u.id AND p.email IS NULL;

-- 2. Friendships Table
CREATE TABLE IF NOT EXISTS public.friendships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  receiver_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  status text CHECK (status IN ('pending', 'accepted', 'declined')) NOT NULL DEFAULT 'pending',
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_friendship UNIQUE (requester_id, receiver_id)
);

CREATE INDEX IF NOT EXISTS friendships_requester_idx ON public.friendships (requester_id);
CREATE INDEX IF NOT EXISTS friendships_receiver_idx ON public.friendships (receiver_id);
CREATE INDEX IF NOT EXISTS friendships_status_idx ON public.friendships (status);

-- 3. Leaderboard Snapshots Table
CREATE TABLE IF NOT EXISTS public.leaderboard_snapshots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  week_start date NOT NULL,
  weekly_xp integer DEFAULT 0 NOT NULL,
  streak_days integer DEFAULT 0 NOT NULL,
  operations_completed integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  CONSTRAINT unique_user_week UNIQUE (user_id, week_start)
);

CREATE INDEX IF NOT EXISTS leaderboard_snapshots_week_start_idx ON public.leaderboard_snapshots (week_start);
CREATE INDEX IF NOT EXISTS leaderboard_snapshots_weekly_xp_idx ON public.leaderboard_snapshots (weekly_xp DESC);

-- 4. Leaderboard Events Table
CREATE TABLE IF NOT EXISTS public.leaderboard_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  event_type text CHECK (event_type IN (
    'empress_liberated',
    'boss_raid_completed',
    'scythe_evolved',
    'streak_milestone',
    'task_completed'
  )) NOT NULL,
  event_description text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

-- Ensure check constraint matches on existing DB
ALTER TABLE public.leaderboard_events DROP CONSTRAINT IF EXISTS leaderboard_events_event_type_check;
ALTER TABLE public.leaderboard_events ADD CONSTRAINT leaderboard_events_event_type_check CHECK (event_type IN (
  'empress_liberated',
  'boss_raid_completed',
  'scythe_evolved',
  'streak_milestone',
  'task_completed'
));

CREATE INDEX IF NOT EXISTS leaderboard_events_user_idx ON public.leaderboard_events (user_id);
CREATE INDEX IF NOT EXISTS leaderboard_events_created_idx ON public.leaderboard_events (created_at DESC);

-- 5. Legions Table
CREATE TABLE IF NOT EXISTS public.legions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  creator_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  owner_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  level integer DEFAULT 1 NOT NULL,
  total_xp integer DEFAULT 0 NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS legions_owner_idx ON public.legions (owner_id);

-- 6. Legion Members Table
CREATE TABLE IF NOT EXISTS public.legion_members (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legion_id uuid REFERENCES public.legions(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  role text CHECK (role IN ('creator', 'member')) DEFAULT 'member' NOT NULL,
  joined_at timestamp with time zone DEFAULT now() NOT NULL,
  status text CHECK (status IN ('active', 'removed')) DEFAULT 'active' NOT NULL,
  CONSTRAINT unique_legion_member UNIQUE (legion_id, user_id)
);

CREATE INDEX IF NOT EXISTS legion_members_legion_idx ON public.legion_members (legion_id);
CREATE INDEX IF NOT EXISTS legion_members_user_idx ON public.legion_members (user_id);
CREATE INDEX IF NOT EXISTS legion_members_status_idx ON public.legion_members (status);

-- 7. Legion Operations Table
CREATE TABLE IF NOT EXISTS public.legion_operations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legion_id uuid REFERENCES public.legions(id) ON DELETE CASCADE NOT NULL,
  parent_task_id uuid NOT NULL, -- Client-side generated task id referencing the main task log
  status text CHECK (status IN (
    'acceptance_open',
    'locked',
    'active',
    'success',
    'failed'
  )) DEFAULT 'acceptance_open' NOT NULL,
  deadline timestamp with time zone NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  locked_at timestamp with time zone,
  completed_at timestamp with time zone
);

CREATE INDEX IF NOT EXISTS legion_operations_legion_idx ON public.legion_operations (legion_id);
CREATE INDEX IF NOT EXISTS legion_operations_status_idx ON public.legion_operations (status);

-- 8. Legion Subtasks Table
CREATE TABLE IF NOT EXISTS public.legion_subtasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legion_operation_id uuid REFERENCES public.legion_operations(id) ON DELETE CASCADE NOT NULL,
  assigned_to uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  task_id uuid NOT NULL, -- Individual task created on assignee's side
  title text, -- Sub-task custom title/objective name
  deadline timestamp with time zone, -- Sub-task custom deadline
  priority text DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'boss')), -- Sub-task custom priority
  acceptance_status text CHECK (acceptance_status IN (
    'pending',
    'accepted',
    'declined',
    'removed_pre_start'
  )) DEFAULT 'pending' NOT NULL,
  completion_status text CHECK (completion_status IN (
    'incomplete',
    'completed',
    'covered',
    'restrained',
    'voided_creator_deletion'
  )) DEFAULT 'incomplete' NOT NULL,
  completed_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL, -- Nullable, set if someone else covers
  xp_value integer NOT NULL,
  xp_awarded boolean DEFAULT false NOT NULL,
  note text, -- Post-failure user-written explanation
  restrained_at timestamp with time zone,
  restrained_by uuid REFERENCES public.profiles(id) ON DELETE SET NULL
);

CREATE INDEX IF NOT EXISTS legion_subtasks_operation_idx ON public.legion_subtasks (legion_operation_id);
CREATE INDEX IF NOT EXISTS legion_subtasks_assigned_idx ON public.legion_subtasks (assigned_to);

-- 9. Legion Events Table
CREATE TABLE IF NOT EXISTS public.legion_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  legion_id uuid REFERENCES public.legions(id) ON DELETE CASCADE NOT NULL,
  event_type text CHECK (event_type IN (
    'operation_started',
    'subtask_accepted',
    'subtask_declined',
    'subtask_completed',
    'subtask_covered',
    'member_restrained',
    'operation_success',
    'operation_failed',
    'ownership_transferred'
  )) NOT NULL,
  actor_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  target_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  metadata jsonb DEFAULT '{}'::jsonb NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS legion_events_legion_idx ON public.legion_events (legion_id);
CREATE INDEX IF NOT EXISTS legion_events_created_idx ON public.legion_events (created_at DESC);

-- 10. War Terminal Log Table (Optional analytical logging)
CREATE TABLE IF NOT EXISTS public.war_terminal_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  raw_input text NOT NULL,
  parsed_command text NOT NULL,
  success boolean DEFAULT true NOT NULL,
  error_message text,
  created_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS war_terminal_log_user_idx ON public.war_terminal_log (user_id);
CREATE INDEX IF NOT EXISTS war_terminal_log_created_idx ON public.war_terminal_log (created_at DESC);


-- ----------------------------------------------------
-- Row Level Security (RLS) Policies
-- ----------------------------------------------------

ALTER TABLE public.friendships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_snapshots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legion_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legion_operations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legion_subtasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.legion_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.war_terminal_log ENABLE ROW LEVEL SECURITY;

-- Profiles read access (users can search other profiles)
CREATE POLICY profiles_read_all ON public.profiles
  FOR SELECT USING (true);

-- Friendships Policies
CREATE POLICY friendships_select ON public.friendships
  FOR SELECT USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY friendships_insert ON public.friendships
  FOR INSERT WITH CHECK (auth.uid() = requester_id);

CREATE POLICY friendships_update ON public.friendships
  FOR UPDATE USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

CREATE POLICY friendships_delete ON public.friendships
  FOR DELETE USING (auth.uid() = requester_id OR auth.uid() = receiver_id);

-- Leaderboard Snapshots Policies
CREATE POLICY leaderboard_select_all ON public.leaderboard_snapshots
  FOR SELECT USING (true); -- Public/Friend reading

CREATE POLICY leaderboard_upsert_own ON public.leaderboard_snapshots
  FOR ALL USING (auth.uid() = user_id);

-- Leaderboard Events Policies
CREATE POLICY leaderboard_events_select ON public.leaderboard_events
  FOR SELECT USING (true);

CREATE POLICY leaderboard_events_insert_own ON public.leaderboard_events
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Legions Policies (Anyone can read, members can write/update)
CREATE POLICY legions_select ON public.legions
  FOR SELECT USING (true);

CREATE POLICY legions_insert ON public.legions
  FOR INSERT WITH CHECK (auth.uid() = creator_id);

CREATE POLICY legions_update ON public.legions
  FOR UPDATE USING (
    auth.uid() = owner_id OR
    EXISTS (
      SELECT 1 FROM public.legion_members
      WHERE legion_id = id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- Legion Members Policies
CREATE POLICY legion_members_select ON public.legion_members
  FOR SELECT USING (true);

CREATE POLICY legion_members_insert ON public.legion_members
  FOR INSERT WITH CHECK (auth.uid() = user_id OR EXISTS (
    SELECT 1 FROM public.legions WHERE id = legion_id AND owner_id = auth.uid()
  ));

CREATE POLICY legion_members_update ON public.legion_members
  FOR UPDATE USING (
    auth.uid() = user_id OR 
    EXISTS (
      SELECT 1 FROM public.legions WHERE id = legion_id AND owner_id = auth.uid()
    )
  );

-- Legion Operations Policies
CREATE POLICY legion_ops_select ON public.legion_operations
  FOR SELECT USING (true);

CREATE POLICY legion_ops_all ON public.legion_operations
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.legion_members
      WHERE legion_id = legion_operations.legion_id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- Legion Subtasks Policies
CREATE POLICY legion_subtasks_select ON public.legion_subtasks
  FOR SELECT USING (true);

CREATE POLICY legion_subtasks_all ON public.legion_subtasks
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.legion_operations op
      JOIN public.legion_members m ON op.legion_id = m.legion_id
      WHERE op.id = legion_subtasks.legion_operation_id 
        AND m.user_id = auth.uid() 
        AND m.status = 'active'
    )
  );

-- Legion Events Policies
CREATE POLICY legion_events_select ON public.legion_events
  FOR SELECT USING (true);

CREATE POLICY legion_events_insert ON public.legion_events
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.legion_members
      WHERE legion_id = legion_events.legion_id AND user_id = auth.uid() AND status = 'active'
    )
  );

-- War Terminal Log Policies
CREATE POLICY war_terminal_log_all ON public.war_terminal_log
  FOR ALL USING (auth.uid() = user_id);
