---
title: "ساخت وب‌سایت‌های فوق‌العاده سریع با Astro: راهنمای کامل"
description: "کشف کنید که چگونه معماری جزیره‌ای نوآورانه Astro و رویکرد بدون جاوااسکریپت می‌تواند گردش کار توسعه وب شما را متحول کند و عملکرد بی‌نظیری ارائه دهد."
pubDate: 2024-01-15
heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
tags: ["astro", "عملکرد", "توسعه-وب", "سایت-استاتیک", "جاوااسکریپت"]
author: "سارا چن"
featured: true
lang: "fa"
postSlug: "getting-started-with-astro"
---

# شروع کار با Astro

Astro یک تولیدکننده سایت استاتیک انقلابی است که نحوه تفکر ما درباره ساخت وب‌سایت‌ها را تغییر می‌دهد. با رویکرد منحصر به فرد خود در ارسال صفر جاوااسکریپت به طور پیش‌فرض، Astro وب‌سایت‌هایی فوق‌العاده سریع ارائه می‌دهد و در عین حال همچنان امکان استفاده از فریم‌ورک‌های UI مورد علاقه شما را در صورت نیاز فراهم می‌کند.

## چه چیزی Astro را خاص می‌کند؟

### صفر جاوااسکریپت به طور پیش‌فرض
برخلاف سایر فریم‌ورک‌هایی که بسته‌های جاوااسکریپت را صرف نظر از اینکه به آن‌ها نیاز دارید یا نه ارسال می‌کنند، Astro تنها زمانی جاوااسکریپت را شامل می‌کند که صراحتاً آن را انتخاب کنید. این منجر به:

- **سرعت بارگذاری فوق‌العاده**: صفحات بدون جاوااسکریپت غیرضروری
- **SEO بهتر**: محتوای کاملاً رندر شده در سمت سرور
- **تجربه کاربری بهتر**: عدم تأخیر در تعامل

### معماری جزیره‌ای
Astro از مفهوم "جزایر" استفاده می‌کند - قطعات تعاملی کوچک در دریایی از HTML استاتیک:

```astro
---
// این کد در سمت سرور اجرا می‌شود
const data = await fetch('https://api.example.com/data');
---

<div>
  <!-- HTML استاتیک -->
  <h1>سایت من</h1>
  
  <!-- جزیره تعاملی -->
  <InteractiveComponent client:load data={data} />
  
  <!-- بیشتر HTML استاتیک -->
  <footer>کپی‌رایت 2024</footer>
</div>
```

### پشتیبانی از چندین فریم‌ورک
می‌توانید React، Vue، Svelte، و سایر فریم‌ورک‌ها را در یک پروژه Astro ترکیب کنید:

```astro
---
import ReactComponent from './ReactComponent.jsx';
import VueComponent from './VueComponent.vue';
import SvelteComponent from './SvelteComponent.svelte';
---

<div>
  <ReactComponent client:visible />
  <VueComponent client:idle />
  <SvelteComponent client:media="(max-width: 768px)" />
</div>
```

## نصب و راه‌اندازی

### ایجاد پروژه جدید
```bash
# ایجاد پروژه جدید
npm create astro@latest my-astro-site

# ورود به پوشه پروژه
cd my-astro-site

# نصب وابستگی‌ها
npm install

# اجرای سرور توسعه
npm run dev
```

### ساختار پروژه
```
my-astro-site/
├── src/
│   ├── components/
│   ├── layouts/
│   ├── pages/
│   └── styles/
├── public/
├── astro.config.mjs
└── package.json
```

## ایجاد اولین صفحه

صفحات در Astro در پوشه `src/pages/` ایجاد می‌شوند:

```astro
---
// src/pages/index.astro
const title = "خوش آمدید به Astro";
---

<html>
  <head>
    <title>{title}</title>
  </head>
  <body>
    <h1>{title}</h1>
    <p>این اولین صفحه Astro من است!</p>
  </body>
</html>
```

## ویژگی‌های پیشرفته

### مجموعه‌های محتوا
مجموعه‌های محتوای Astro مدیریت محتوای type-safe ارائه می‌دهند:

```typescript
// src/content/config.ts
import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.date(),
    tags: z.array(z.string()),
  }),
});

export const collections = { blog };
```

### کامپوننت‌ها و Layout ها
```astro
---
// src/layouts/BaseLayout.astro
export interface Props {
  title: string;
}

const { title } = Astro.props;
---

<!DOCTYPE html>
<html>
  <head>
    <title>{title}</title>
    <meta charset="utf-8" />
  </head>
  <body>
    <slot />
  </body>
</html>
```

### استایل‌دهی
Astro از CSS، Sass، و CSS-in-JS پشتیبانی می‌کند:

```astro
---
// کامپوننت
---

<style>
  /* استایل‌های محدود به کامپوننت */
  h1 {
    color: blue;
  }
</style>

<style is:global>
  /* استایل‌های سراسری */
  body {
    font-family: Arial, sans-serif;
  }
</style>

<h1>عنوان من</h1>
```

## بهینه‌سازی عملکرد

### تصاویر
```astro
---
import { Image } from 'astro:assets';
import myImage from '../assets/image.jpg';
---

<Image src={myImage} alt="توضیح تصویر" />
```

### CSS و JavaScript
```astro
---
// بارگذاری شرطی CSS
const isDark = Astro.cookies.get('theme')?.value === 'dark';
---

{isDark && <link rel="stylesheet" href="/dark-theme.css" />}

<script>
  // جاوااسکریپت inline
  console.log('سلام از Astro!');
</script>
```

## استقرار

### Vercel
```bash
npm install @astrojs/vercel
```

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  output: 'server',
  adapter: vercel(),
});
```

### Netlify
```bash
npm install @astrojs/netlify
```

### GitHub Pages
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## نتیجه‌گیری

Astro راه جدیدی برای ساخت وب‌سایت‌های سریع و مدرن ارائه می‌دهد. با تمرکز بر عملکرد و تجربه توسعه‌دهنده، این فریم‌ورک انتخاب عالی برای:

- **وبلاگ‌ها و سایت‌های محتوایی**
- **سایت‌های شرکتی**
- **فروشگاه‌های آنلاین**
- **مستندات**

با Astro، می‌توانید وب‌سایت‌هایی بسازید که هم برای کاربران و هم برای موتورهای جستجو بهینه باشند، بدون اینکه از قدرت فریم‌ورک‌های مدرن چشم‌پوشی کنید.
