import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const experience = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/experience' }),
  schema: z.object({
    company: z.string(),
    role: z.string(),
    location: z.string().optional(),
    startDate: z.string(), // e.g. "Dec 2025"
    endDate: z.string(), // e.g. "Present"
    // Decap's number widget writes an empty string ("") when the field is cleared
    // and saved rather than omitting it, which z.number() rejects outright and
    // fails the whole build. z.coerce.number() treats "" as 0 (and .catch() covers
    // any other uncoercible value), the same defensive pattern as blog.date below.
    order: z.coerce.number().catch(() => 0), // lower = more recent, controls display order
    // One-line summary shown on the compact homepage timeline; the full
    // write-up (body, bullet points) only renders on the entry's own page.
    summary: z.string(),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    githubUrl: z.string().url().optional(),
    liveUrl: z.string().url().optional(),
    status: z.enum(['current', 'past']),
    featured: z.boolean().default(false),
    date: z.string(), // e.g. "2026-01"
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Decap's date widget writes dates back unquoted, which YAML parses as a native
    // timestamp (not a string). z.coerce.date() accepts a quoted string, an unquoted
    // YAML timestamp, or a Date object alike, so it's immune to that either way.
    // .catch() is a second safety net: if a future CMS quirk ever writes something
    // uncoercible (as "{{now}}" did once, unresolved), fall back to today rather than
    // failing content validation and breaking the ENTIRE site build over one field.
    date: z.coerce.date().catch(() => new Date()),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    // Optional manual override: lower numbers sort first, ties/zero fall back to date.
    // Same empty-string CMS quirk as experience.order above, same fix.
    order: z.coerce.number().catch(() => 0),
    // Slugs (entry ids) of related projects/experience entries, set via a Decap
    // relation widget. Left unconstrained (not z.enum of known ids) so a stale
    // reference to a renamed/deleted entry can't break the whole site build —
    // pages just filter it out when resolving.
    projects: z.array(z.string()).default([]),
    experiences: z.array(z.string()).default([]),
  }),
});

export const collections = { experience, projects, blog };
