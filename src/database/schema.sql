-- Cosmic Letters: Supabase schema
-- Run this once in your project's SQL editor (Supabase dashboard -> SQL Editor -> New query).

create table if not exists messages (
  id            text primary key,
  message_text  text not null check (char_length(message_text) <= 500),
  category      text not null default 'random',
  created_at    timestamptz not null default now(),
  visibility    text not null default 'public' check (visibility in ('public', 'private')),
  likes         integer not null default 0,
  anonymous_id  text,
  access_token  text unique,
  star_x        float not null,
  star_y        float not null
);

create index if not exists messages_visibility_created_at_idx
  on messages (visibility, created_at desc);

-- Row Level Security: the app has no login, so every visitor uses the
-- public "anon" key. Access control lives entirely in these policies.
alter table messages enable row level security;

-- Anyone can read public messages.
create policy "Public messages are readable"
  on messages for select
  using (visibility = 'public');

-- Anyone can create a message (public or private).
create policy "Anyone can create a message"
  on messages for insert
  with check (true);

-- No update/delete policy is defined, so nobody can edit or remove a
-- message directly. Likes are only ever mutated through adjust_likes()
-- below, and private messages are only ever read through
-- get_message_by_token() below, both of which run with elevated
-- privilege (security definer) so they can bypass the policies above
-- in a narrow, controlled way.

create or replace function get_message_by_token(p_token text)
returns setof messages
language sql
security definer
set search_path = public
as $$
  select * from messages
  where access_token = p_token and visibility = 'private';
$$;

grant execute on function get_message_by_token(text) to anon;

create or replace function adjust_likes(p_id text, p_delta integer)
returns setof messages
language sql
security definer
set search_path = public
as $$
  update messages
  set likes = greatest(0, likes + p_delta)
  where id = p_id
  returning *;
$$;

grant execute on function adjust_likes(text, integer) to anon;

-- Seeds a handful of starter messages so the app isn't empty on a
-- fresh project. Only runs once, when the table is empty; safe to
-- delete this block if you'd rather start blank.
insert into messages (id, message_text, category, created_at, visibility, likes, anonymous_id, star_x, star_y)
select * from (values
  ('seed1', 'I hope someone somewhere knows they are doing better than they think.', 'dream', now() - interval '10 hours', 'public', 15, 'seed_1', random(), random()),
  ('seed2', 'To the person who smiled at me on the train, you changed my whole day.', 'hope', now() - interval '1 day', 'public', 22, 'seed_2', random(), random()),
  ('seed3', 'I still think about the conversation we never had.', 'secret', now() - interval '2 days', 'public', 9, 'seed_3', random(), random()),
  ('seed4', 'I am terrified of failing but more terrified of never trying.', 'confession', now() - interval '3 hours', 'public', 31, 'seed_4', random(), random()),
  ('seed5', 'Dear universe, please let them be happy.', 'hope', now() - interval '5 hours', 'public', 40, 'seed_5', random(), random()),
  ('seed6', 'Sometimes the bravest thing is just waking up again.', 'random', now() - interval '20 hours', 'public', 6, 'seed_6', random(), random()),
  ('seed7', 'I forgive you, even though you will never know.', 'secret', now() - interval '4 days', 'public', 18, 'seed_7', random(), random()),
  ('seed8', 'What if everything works out better than we imagined?', 'dream', now() - interval '6 hours', 'public', 27, 'seed_8', random(), random())
) as seed(id, message_text, category, created_at, visibility, likes, anonymous_id, star_x, star_y)
where not exists (select 1 from messages);
