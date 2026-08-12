-- VOCAB ORBIT — Supabase schema (name-only profiles, no password/email auth)
-- Run this once in your Supabase project's SQL Editor.
--
-- NOTE ON SECURITY: there is no login/password here. "profile_name" is just a
-- text label the app uses to group each person's words together. Because the
-- anon key is used for all requests, RLS below allows any request through —
-- privacy comes only from people not knowing/guessing each other's name.
-- Do not store anything sensitive here.

create extension if not exists "pgcrypto";

create table if not exists words (
  id uuid primary key default gen_random_uuid(),
  profile_name text not null,
  word text not null,
  phonetic text default '',
  def_en text default '',
  meaning_th text default '',
  correct_streak int default 0,
  wrong_streak int default 0,
  times_asked int default 0,
  added_at timestamptz default now(),
  unique(profile_name, word)
);
create index if not exists words_profile_idx on words(profile_name);

create table if not exists daily_quizzes (
  id uuid primary key default gen_random_uuid(),
  profile_name text not null,
  quiz_date date not null,
  questions jsonb not null default '[]',
  current_index int default 0,
  score int default 0,
  insufficient boolean default false,
  unique(profile_name, quiz_date)
);
create index if not exists quizzes_profile_idx on daily_quizzes(profile_name);

alter table words enable row level security;
alter table daily_quizzes enable row level security;

drop policy if exists "Users manage own words" on words;
drop policy if exists "open access words" on words;
create policy "open access words" on words
  for all
  using (true)
  with check (true);

drop policy if exists "Users manage own quizzes" on daily_quizzes;
drop policy if exists "open access quizzes" on daily_quizzes;
create policy "open access quizzes" on daily_quizzes
  for all
  using (true)
  with check (true);
