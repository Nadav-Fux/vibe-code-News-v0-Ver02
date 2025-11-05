-- Add featured_image column to articles table
ALTER TABLE articles 
ADD COLUMN IF NOT EXISTS featured_image TEXT;

-- Add comment
COMMENT ON COLUMN articles.featured_image IS 'URL of the featured image from Vercel Blob';
