-- Insert default categories
insert into public.categories (name, slug, description) values
  ('Technology', 'technology', 'Articles about technology and innovation'),
  ('Design', 'design', 'UI/UX design and creative content'),
  ('Development', 'development', 'Software development and programming'),
  ('Business', 'business', 'Business strategies and entrepreneurship'),
  ('AI & ML', 'ai-ml', 'Artificial Intelligence and Machine Learning')
on conflict (slug) do nothing;

-- Insert default tags
insert into public.tags (name, slug) values
  ('Next.js', 'nextjs'),
  ('React', 'react'),
  ('TypeScript', 'typescript'),
  ('Supabase', 'supabase'),
  ('AI', 'ai'),
  ('Design Systems', 'design-systems'),
  ('Performance', 'performance'),
  ('Security', 'security'),
  ('Testing', 'testing'),
  ('DevOps', 'devops')
on conflict (slug) do nothing;
