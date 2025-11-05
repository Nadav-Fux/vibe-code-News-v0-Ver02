-- הכנסת ידיעות אמיתיות מינואר 2025

-- ידיעה 1: GitHub Copilot חינמי
INSERT INTO news_flashes (content, image_url, is_pinned, created_at)
VALUES (
  'GitHub Copilot עכשיו חינמי! 🎉

מיקרוסופט הכריזה על גרסה חינמית של GitHub Copilot ב-Visual Studio. זה צעד משמעותי שמאפשר לכל מפתח לנסות את כלי ה-AI המתקדם בחינם.',
  'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?w=400',
  false,
  NOW() - INTERVAL '2 hours'
);

-- ידיעה 2: JetBrains Junie
INSERT INTO news_flashes (content, image_url, is_pinned, created_at)
VALUES (
  'JetBrains משיקה Junie - סוכן קידוד חדש 🤖

JetBrains חשפה את Junie, סוכן AI חדש לקידוד שמתחרה ישירות ב-GitHub Copilot. הכלי מבטיח יכולות מתקדמות של הבנת קוד ויצירה אוטומטית.',
  'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400',
  false,
  NOW() - INTERVAL '5 hours'
);

-- ידיעה 3: Google Gemini ב-Chrome DevTools
INSERT INTO news_flashes (content, image_url, is_pinned, created_at)
VALUES (
  'Google משלבת Gemini ב-Chrome DevTools 🔧

גוגל הוסיפה סיוע AI מבוסס Gemini ל-Chrome DevTools. המערכת עוזרת למפתחים לדבג בעיות CSS ו-styling באופן אינטראקטיבי ומהיר יותר.',
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
  false,
  NOW() - INTERVAL '8 hours'
);

-- ידיעה 4: הגל השני של AI בקידוד
INSERT INTO news_flashes (content, image_url, is_pinned, created_at)
VALUES (
  'הגל השני של AI בקידוד כבר כאן! 🚀

MIT Technology Review מדווח על "הגל השני" של כלי AI לקידוד - מעבר מהשלמה אוטומטית פשוטה ליכולות של פרוטוטייפ, בדיקה ודיבאג מלאות. ב-Google, יותר מרבע מהקוד החדש כבר נוצר על ידי AI!',
  null,
  true,
  NOW() - INTERVAL '12 hours'
);

-- ידיעה 5: GPT-5 vs Gemini 2.5 vs Claude 4.5
INSERT INTO news_flashes (content, image_url, is_pinned, created_at)
VALUES (
  'מלחמת המודלים: GPT-5 מול Gemini 2.5 מול Claude 4.5 ⚔️

השוואה חדשה מראה שכל מודל מצטיין בתחום אחר: GPT-5 בכתיבה רב-תכליתית, Gemini 2.5 במשימות מולטימודליות ומחקר עמוק, ו-Claude 4.5 בהיגיון ודיבאג מורכב. אין מנצח אחד - הכל תלוי במשימה!',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
  false,
  NOW() - INTERVAL '1 day'
);

-- ידיעה 6: סטארטאפים חדשים ב-AI Coding
INSERT INTO news_flashes (content, image_url, is_pinned, created_at)
VALUES (
  'גל חדש של סטארטאפים ב-AI Coding 💡

חברות חדשות כמו Zencoder, Merly, Cosine, Tessl ו-Poolside נכנסות לשוק ה-AI Coding עם גישות חדשניות. המטרה: לייצר קוד שעובד מהפעם הראשונה על ידי הבנת תהליך החשיבה מאחורי פיתוח תוכנה.',
  'https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=400',
  false,
  NOW() - INTERVAL '1 day 6 hours'
);
