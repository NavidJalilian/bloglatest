import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => {
    return !data.draft && data.lang === 'fa';
  });

  return rss({
    title: 'لومن - رشد شخصی و موفقیت',
    description: 'مجله دیجیتال لومن با تمرکز بر رشد شخصی، موفقیت حرفه‌ای و بهترین روش‌های جهانی برای بهبود زندگی',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        author: post.data.author,
        link: `/fa/blog/${post.slug}/`,
        categories: post.data.tags,
      })),
    customData: `<language>fa-ir</language>`,
  });
}
