# Vibe Code GLM Platform

פלטפורמת ניהול תוכן מתקדמת עם תמיכה ב-AI מובנית.

## תכונות עיקריות

- **ניהול תוכן מלא** - מאמרים, קטגוריות, תגיות
- **AI מתקדם** - תמיכה ב-Gemini 2.5, GLM 4.6, Minimax 2
- **אימות והרשאות** - מערכת תפקידים (Admin/Editor/Viewer)
- **חיפוש מלא** - Full-text search עם fuzzy matching
- **תגובות** - מערכת תגובות מקוננות
- **אנליטיקס** - דשבורד עם גרפים אינטראקטיביים
- **העלאת תמונות** - Vercel Blob integration
- **PWA** - Progressive Web App עם offline support
- **SEO מתקדם** - Sitemap, robots.txt, structured data

## התחלה מהירה

### דרישות מקדימות

- Node.js 20+
- npm או yarn
- חשבון Vercel (לפריסה)
- חשבון Supabase (למסד נתונים)

### התקנה

\`\`\`bash
# התקנת dependencies
npm install

# הרצת סביבת פיתוח
npm run dev

# בניית הפרויקט
npm run build

# הרצת בדיקות
npm test

# הרצת בדיקות עם coverage
npm run test:coverage
\`\`\`

### משתני סביבה

הפרויקט דורש את משתני הסביבה הבאים:

\`\`\`env
# Supabase
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Models
GEMINI_API_KEY=
GLM_API_KEY=
MINIMAX_API_KEY=

# Vercel Blob
BLOB_READ_WRITE_TOKEN=
\`\`\`

## מבנה הפרויקט

\`\`\`
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── auth/              # דפי אימות
│   ├── articles/          # דפי מאמרים
│   └── dashboard/         # דשבורד ניהול
├── components/            # React Components
│   ├── ui/               # UI Components
│   ├── articles/         # קומפוננטים למאמרים
│   ├── ai/               # קומפוננטים ל-AI
│   └── analytics/        # קומפוננטים לאנליטיקס
├── lib/                   # Utilities
│   ├── supabase/         # Supabase clients
│   ├── ai/               # AI configurations
│   └── utils/            # Helper functions
├── scripts/               # SQL Scripts
└── __tests__/            # בדיקות אוטומטיות
\`\`\`

## פריסה

הפרויקט מוכן לפריסה ב-Vercel:

1. חבר את הפרויקט ל-GitHub
2. ייבא ל-Vercel
3. הגדר את משתני הסביבה
4. פרוס!

## בדיקות

הפרויקט כולל בדיקות אוטומטיות עם Jest ו-React Testing Library:

\`\`\`bash
# הרצת כל הבדיקות
npm test

# הרצת בדיקות במצב watch
npm run test:watch

# יצירת דוח coverage
npm run test:coverage
\`\`\`

## תרומה

תרומות מתקבלות בברכה! אנא פתח issue או pull request.

## רישיון

MIT License
