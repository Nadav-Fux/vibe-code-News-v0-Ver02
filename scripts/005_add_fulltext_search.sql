-- Enable pg_trgm extension for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Add full-text search columns to articles
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
  setweight(to_tsvector('english', coalesce(title, '')), 'A') ||
  setweight(to_tsvector('english', coalesce(excerpt, '')), 'B') ||
  setweight(to_tsvector('english', coalesce(content, '')), 'C')
) STORED;

-- Create GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS articles_search_idx ON articles USING GIN (search_vector);

-- Create trigram index for fuzzy search
CREATE INDEX IF NOT EXISTS articles_title_trgm_idx ON articles USING GIN (title gin_trgm_ops);

-- Create search function
CREATE OR REPLACE FUNCTION search_articles(
  search_query TEXT,
  limit_count INT DEFAULT 10,
  offset_count INT DEFAULT 0
)
RETURNS TABLE (
  id UUID,
  title TEXT,
  slug TEXT,
  excerpt TEXT,
  content TEXT,
  status TEXT,
  author_id UUID,
  category_id UUID,
  views INT,
  created_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    a.id,
    a.title,
    a.slug,
    a.excerpt,
    a.content,
    a.status,
    a.author_id,
    a.category_id,
    a.views,
    a.created_at,
    a.updated_at,
    ts_rank(a.search_vector, websearch_to_tsquery('english', search_query)) AS rank
  FROM articles a
  WHERE 
    a.status = 'published' AND
    (
      a.search_vector @@ websearch_to_tsquery('english', search_query) OR
      a.title ILIKE '%' || search_query || '%'
    )
  ORDER BY rank DESC, a.created_at DESC
  LIMIT limit_count
  OFFSET offset_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION search_articles TO authenticated, anon;
