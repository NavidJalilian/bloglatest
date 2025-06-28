import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog', ({ data }) => {
    return !data.draft;
  });

  return rss({
    title: 'DevBlog',
    description: 'A modern developer blog featuring the latest in web development, programming tutorials, and tech insights.',
    site: context.site,
    items: posts
      .sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
      .map((post) => ({
        title: post.data.title,
        pubDate: post.data.pubDate,
        description: post.data.description,
        author: post.data.author,
        link: `/blog/${post.slug}/`,
        categories: post.data.tags,
      })),
    customData: `<language>en-us</language>`,
  });
}
