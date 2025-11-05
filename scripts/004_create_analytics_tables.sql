-- Create analytics events table
create table if not exists public.analytics_events (
  id uuid primary key default uuid_generate_v4(),
  event_type text not null check (event_type in ('page_view', 'article_view', 'article_create', 'article_update', 'article_publish', 'user_signup', 'user_login')),
  user_id uuid references public.profiles(id) on delete set null,
  article_id uuid references public.articles(id) on delete cascade,
  metadata jsonb default '{}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on analytics_events
alter table public.analytics_events enable row level security;

-- Analytics events policies (users can view their own events, admins can view all)
create policy "analytics_events_select_own"
  on public.analytics_events for select
  using (auth.uid() = user_id);

create policy "analytics_events_insert_authenticated"
  on public.analytics_events for insert
  with check (auth.uid() = user_id or user_id is null);

-- Create indexes for better performance
create index if not exists idx_analytics_events_type on public.analytics_events(event_type);
create index if not exists idx_analytics_events_user on public.analytics_events(user_id);
create index if not exists idx_analytics_events_article on public.analytics_events(article_id);
create index if not exists idx_analytics_events_created_at on public.analytics_events(created_at desc);

-- Create materialized view for daily stats
create materialized view if not exists public.daily_analytics as
select
  date_trunc('day', created_at) as date,
  event_type,
  count(*) as event_count,
  count(distinct user_id) as unique_users
from public.analytics_events
group by date_trunc('day', created_at), event_type
order by date desc;

-- Create index on materialized view
create index if not exists idx_daily_analytics_date on public.daily_analytics(date desc);

-- Create function to refresh materialized view
create or replace function public.refresh_daily_analytics()
returns void
language plpgsql
security definer
as $$
begin
  refresh materialized view public.daily_analytics;
end;
$$;
