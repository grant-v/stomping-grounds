-- Stomping Grounds: the My Clips backend.
-- Run this once in your Supabase project (Dashboard -> SQL Editor -> New query -> paste -> Run).
-- It's safe to run again: everything is "if not exists" / "or replace".
--
-- What it makes:
--   * table public.clips          one row per clip (who, trick, where, when, a small thumbnail)
--   * storage bucket "clips"      the video files, at <user id>/<clip id>.<ext>
--   * row-level security          you can only see, add and delete your OWN clips and videos

create table if not exists public.clips (
  id          text primary key,
  user_id     uuid not null default auth.uid() references auth.users (id) on delete cascade,
  name        text not null,
  trick       text not null,
  landed_on   date not null,
  spot        text not null default '',
  style       text not null default 'street' check (style in ('street', 'park')),
  lat         double precision not null check (lat between -90 and 90),
  lng         double precision not null check (lng between -180 and 180),
  city        text not null default '',
  country     text not null default '',
  thumb       text,                          -- small JPEG data URL (about 30 KB)
  video_path  text not null,                 -- path inside the "clips" bucket
  video_name  text not null default '',
  video_type  text not null default '',
  video_size  bigint,
  created_at  timestamptz not null default now()
);

create index if not exists clips_user_idx on public.clips (user_id);

alter table public.clips enable row level security;

drop policy if exists "own clips: read"   on public.clips;
drop policy if exists "own clips: add"    on public.clips;
drop policy if exists "own clips: change" on public.clips;
drop policy if exists "own clips: delete" on public.clips;
create policy "own clips: read"   on public.clips for select to authenticated using ((select auth.uid()) = user_id);
create policy "own clips: add"    on public.clips for insert to authenticated with check ((select auth.uid()) = user_id);
create policy "own clips: change" on public.clips for update to authenticated using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "own clips: delete" on public.clips for delete to authenticated using ((select auth.uid()) = user_id);

-- Private bucket for the videos. 50 MB is the largest single upload the Supabase free plan allows;
-- raise it here (and in cloud.js, MAX_BYTES) if your plan allows bigger files.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('clips', 'clips', false, 52428800, array['video/*'])
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

-- Each person's videos live in a folder named after their user id, and only they can touch it.
drop policy if exists "own videos: read"   on storage.objects;
drop policy if exists "own videos: add"    on storage.objects;
drop policy if exists "own videos: delete" on storage.objects;
create policy "own videos: read" on storage.objects for select to authenticated
  using (bucket_id = 'clips' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own videos: add" on storage.objects for insert to authenticated
  with check (bucket_id = 'clips' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "own videos: delete" on storage.objects for delete to authenticated
  using (bucket_id = 'clips' and (storage.foldername(name))[1] = (select auth.uid())::text);
