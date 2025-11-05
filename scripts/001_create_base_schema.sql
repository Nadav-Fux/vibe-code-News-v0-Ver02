-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create profiles table (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  display_name text,
  avatar_url text,
  bio text,
  role text default 'user' check (role in ('user', 'admin', 'moderator')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

-- Profiles policies
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id);

create policy "profiles_delete_own"
  on public.profiles for delete
  using (auth.uid() = id);

-- Create categories table
create table if not exists public.categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on categories
alter table public.categories enable row level security;

-- Categories policies (read-only for users, admins can manage)
create policy "categories_select_all"
  on public.categories for select
  using (true);

-- Create tags table
create table if not exists public.tags (
  id uuid primary key default uuid_generate_v4(),
  name text not null unique,
  slug text not null unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on tags
alter table public.tags enable row level security;

-- Tags policies (read-only for users)
create policy "tags_select_all"
  on public.tags for select
  using (true);

-- Create articles table
create table if not exists public.articles (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  slug text not null unique,
  content text not null,
  excerpt text,
  cover_image text,
  author_id uuid not null references public.profiles(id) on delete cascade,
  category_id uuid references public.categories(id) on delete set null,
  status text default 'draft' check (status in ('draft', 'published', 'archived')),
  views integer default 0,
  published_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on articles
alter table public.articles enable row level security;

-- Articles policies
create policy "articles_select_published"
  on public.articles for select
  using (status = 'published' or auth.uid() = author_id);

create policy "articles_insert_own"
  on public.articles for insert
  with check (auth.uid() = author_id);

create policy "articles_update_own"
  on public.articles for update
  using (auth.uid() = author_id);

create policy "articles_delete_own"
  on public.articles for delete
  using (auth.uid() = author_id);

-- Create article_tags junction table
create table if not exists public.article_tags (
  article_id uuid references public.articles(id) on delete cascade,
  tag_id uuid references public.tags(id) on delete cascade,
  primary key (article_id, tag_id)
);

-- Enable RLS on article_tags
alter table public.article_tags enable row level security;

-- Article tags policies
create policy "article_tags_select_all"
  on public.article_tags for select
  using (true);

create policy "article_tags_insert_own"
  on public.article_tags for insert
  with check (
    exists (
      select 1 from public.articles
      where id = article_id and author_id = auth.uid()
    )
  );

create policy "article_tags_delete_own"
  on public.article_tags for delete
  using (
    exists (
      select 1 from public.articles
      where id = article_id and author_id = auth.uid()
    )
  );

-- Create comments table
create table if not exists public.comments (
  id uuid primary key default uuid_generate_v4(),
  article_id uuid not null references public.articles(id) on delete cascade,
  author_id uuid not null references public.profiles(id) on delete cascade,
  content text not null,
  parent_id uuid references public.comments(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on comments
alter table public.comments enable row level security;

-- Comments policies
create policy "comments_select_all"
  on public.comments for select
  using (true);

create policy "comments_insert_authenticated"
  on public.comments for insert
  with check (auth.uid() = author_id);

create policy "comments_update_own"
  on public.comments for update
  using (auth.uid() = author_id);

create policy "comments_delete_own"
  on public.comments for delete
  using (auth.uid() = author_id);

-- Create indexes for better performance
create index if not exists idx_articles_author on public.articles(author_id);
create index if not exists idx_articles_category on public.articles(category_id);
create index if not exists idx_articles_status on public.articles(status);
create index if not exists idx_articles_published_at on public.articles(published_at desc);
create index if not exists idx_comments_article on public.comments(article_id);
create index if not exists idx_comments_author on public.comments(author_id);

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$;

-- Create triggers for updated_at
create trigger set_updated_at_profiles
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_articles
  before update on public.articles
  for each row
  execute function public.handle_updated_at();

create trigger set_updated_at_comments
  before update on public.comments
  for each row
  execute function public.handle_updated_at();
