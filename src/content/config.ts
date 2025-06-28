import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    heroImage: z.string().optional(),
    tags: z.array(z.string()).default([]),
    author: z.string().default('Anonymous'),
    draft: z.boolean().default(false),
    featured: z.boolean().default(false),
    lang: z.enum(['en', 'fa']).default('en'),
    // Slug to link corresponding posts in different languages
    // This should be the same for both language versions of a post
    postSlug: z.string().optional(),
  }),
});

export const collections = { blog };
