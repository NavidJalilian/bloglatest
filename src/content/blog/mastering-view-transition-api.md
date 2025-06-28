---
title: "Mastering the View Transition API: Smooth Animations Without Libraries"
description: "Learn how to create smooth page transitions and animations using the native View Transition API, including practical examples for Next.js applications."
pubDate: 2024-12-28
author: "Navid Jalilian"
tags: ["web-development", "javascript", "animations", "nextjs", "performance"]
heroImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop"
featured: true
draft: false
lang: "en"
---

## What is the View Transition API?

The View Transition API is a native browser feature that lets you animate DOM updates or page navigations without third-party libraries. At its core is the method:

```javascript
document.startViewTransition(() => {
  // apply your DOM updates here
  updateTheDOMSomehow();
});
```

### How it works

1. Captures the "old" view
2. Runs your callback to mutate the DOM
3. Captures the "new" view
4. Animates between them

Internally, you get pseudo-elements like:

```css
::view-transition
└─ ::view-transition-group(root)
   └─ ::view-transition-image-pair(root)
      ├─ ::view-transition-old(root)
      └─ ::view-transition-new(root)
```

By default, the old view fades out and the new view fades in (via `opacity`).

### Browser support
Chrome-based browsers and Safari only.

## Customizing Transitions with CSS

To override the default fade, target the pseudo-elements in your CSS:

```css
/* animate the old view out */
::view-transition-old(root) {
  animation: pop-out 0.3s ease;
}

/* animate the new view in */
::view-transition-new(root) {
  animation: pop-in 0.3s ease;
}
```

Define your `@keyframes pop-in` and `pop-out` elsewhere in your stylesheet.

## Targeting a Specific Element

If you only want to animate one element instead of the whole page:

1. Give it a view-transition name: `.box { view-transition-name: box; }`
2. Then target it with:

```css
::view-transition-old(box) { 
  animation: skew-out 0.3s ease; 
} 

::view-transition-new(box) { 
  animation: skew-in 0.3s ease; 
}
```

To apply the same animation to multiple elements, use a class-based transition:

```css
/* in your CSS */
.box, .card {
  view-transition-class: myShared;
}

/* then for the pseudo-elements */
::view-transition-old(.myShared) { … }
::view-transition-new(.myShared) { … }
```

## Two Types of Transitions

1. **Single-document transitions** (e.g. showing/hiding parts of the same page):  
   You must call `startViewTransition` yourself.
2. **Multi-document/page transitions** (navigating between URLs):  
   The browser kicks off the transition automatically on navigation—no manual call needed.

## Enabling in Next.js

This feature is still experimental in Next.js (v15.2.0+). To turn it on:

```javascript
// next.config.js
module.exports = {
  experimental: {
    viewTransition: true,
  },
};
```

Then restart your dev server.

## Using the `unstable_viewTransition` Component

React exposes an experimental `<ViewTransition>` wrapper:

```jsx
import { unstable_viewTransition as ViewTransition } from 'react';

export default function MyComponent() {
  return (
    <ViewTransition name="box">
      <div className="box">Hello, world!</div>
    </ViewTransition>
  );
}
```

### Props
- `name`: maps to `view-transition-name`
- `className`: applies a `view-transition-class`
- `enter` / `exit`: CSS class names for mount/unmount animations

## Full Example: Page Navigation in Next.js

Imagine two pages under `/blog`:

### `/pages/blog/index.js`

```jsx
import { unstable_viewTransition as ViewTransition } from 'react';
import Link from 'next/link';

export default function BlogList() {
  return (
    <ViewTransition name="post-list">
      <ul>
        <li><Link href="/blog/post/hello">Hello</Link></li>
        <li><Link href="/blog/post/world">World</Link></li>
      </ul>
    </ViewTransition>
  );
}
```

### `/pages/blog/post/[slug].js`

```jsx
import { unstable_viewTransition as ViewTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Post() {
  const { slug } = useRouter().query;
  return (
    <ViewTransition name="post-list">
      <h1>Post: {slug}</h1>
      <p>Here's the post content…</p>
      <Link href="/blog">← Back to list</Link>
    </ViewTransition>
  );
}
```

Because both pages wrap their content in a `<ViewTransition name="post-list">`, navigating between them will animate that shared element.

## Limitations & Next Steps

- **Experimental**: APIs and component names may change.
- **Browser support**: Only Chrome-based and Safari today.
- **Performance**: Test on realistic UIs—complex or many elements can add overhead.

Once stable, you'll be able to define reusable page-transition presets (think how Nuxt.js does it) and build even smoother, more consistent navigation animations.
