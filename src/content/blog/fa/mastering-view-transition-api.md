---
title: "تسلط بر View Transition API: انیمیشن‌های روان بین صفحات"
description: "یاد بگیرید چگونه از View Transition API جدید مرورگرها برای ایجاد انیمیشن‌های زیبا و روان بین صفحات وب استفاده کنید."
pubDate: 2024-12-28
author: "نوید جلیلیان"
tags: ["web-api", "انیمیشن", "تجربه-کاربری", "css", "جاوااسکریپت"]
heroImage: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=400&fit=crop"
featured: false
draft: false
lang: "fa"
postSlug: "mastering-view-transition-api"
---

# تسلط بر View Transition API

View Transition API یکی از هیجان‌انگیزترین ویژگی‌های جدید وب است که امکان ایجاد انیمیشن‌های روان و حرفه‌ای بین تغییرات DOM را فراهم می‌کند. این API به شما اجازه می‌دهد تجربه‌ای شبیه به اپلیکیشن‌های موبایل native در وب ایجاد کنید.

## مقدمه‌ای بر View Transition API

### مشکل سنتی
```javascript
// روش قدیمی: تغییر ناگهانی محتوا
function updateContent() {
  document.getElementById('content').innerHTML = newContent;
  // تغییر فوری و بدون انیمیشن
}
```

### راه‌حل جدید
```javascript
// با View Transition API
function updateContentWithTransition() {
  if (!document.startViewTransition) {
    // Fallback برای مرورگرهای قدیمی
    updateContent();
    return;
  }
  
  document.startViewTransition(() => {
    updateContent();
  });
}
```

## مفاهیم پایه

### 1. View Transition Names
```css
/* تعریف نام برای عناصر */
.hero-image {
  view-transition-name: hero;
}

.article-title {
  view-transition-name: title;
}

.content-area {
  view-transition-name: content;
}
```

### 2. Transition Lifecycle
```javascript
async function performTransition() {
  const transition = document.startViewTransition(() => {
    // تغییرات DOM
    updateDOM();
  });
  
  // منتظر تکمیل انیمیشن
  await transition.finished;
  console.log('Transition completed!');
}
```

## انواع Transitions

### 1. Same-Document Transitions
```javascript
// انیمیشن در همان صفحه
function toggleView() {
  document.startViewTransition(() => {
    const container = document.querySelector('.container');
    container.classList.toggle('expanded');
  });
}
```

### 2. Cross-Document Transitions (آینده)
```javascript
// انیمیشن بین صفحات مختلف
function navigateWithTransition(url) {
  if (document.createDocumentTransition) {
    document.createDocumentTransition().start(() => {
      window.location.href = url;
    });
  } else {
    window.location.href = url;
  }
}
```

## مثال‌های عملی

### 1. Image Gallery Transition
```html
<div class="gallery">
  <img src="thumb1.jpg" class="thumbnail" onclick="expandImage(this)">
  <img src="thumb2.jpg" class="thumbnail" onclick="expandImage(this)">
</div>

<div class="modal" id="modal" style="display: none;">
  <img id="expanded-image" class="expanded">
</div>
```

```css
.thumbnail {
  view-transition-name: gallery-image;
  width: 150px;
  height: 150px;
  object-fit: cover;
}

.expanded {
  view-transition-name: gallery-image;
  width: 80vw;
  height: 80vh;
  object-fit: contain;
}

/* کنترل انیمیشن */
::view-transition-old(gallery-image),
::view-transition-new(gallery-image) {
  animation-duration: 0.5s;
  animation-timing-function: ease-in-out;
}
```

```javascript
function expandImage(thumbnail) {
  document.startViewTransition(() => {
    const modal = document.getElementById('modal');
    const expandedImage = document.getElementById('expanded-image');
    
    expandedImage.src = thumbnail.src.replace('thumb', 'full');
    modal.style.display = 'block';
    thumbnail.style.display = 'none';
  });
}
```

### 2. List to Detail Transition
```css
.list-item {
  view-transition-name: var(--item-name);
}

.detail-view {
  view-transition-name: var(--item-name);
}

/* انیمیشن سفارشی */
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 0.3s;
}

::view-transition-old(item-1) {
  animation: slide-out-left 0.3s ease-in;
}

::view-transition-new(item-1) {
  animation: slide-in-right 0.3s ease-out;
}

@keyframes slide-out-left {
  to { transform: translateX(-100%); }
}

@keyframes slide-in-right {
  from { transform: translateX(100%); }
}
```

### 3. Theme Toggle Transition
```javascript
function toggleTheme() {
  document.startViewTransition(() => {
    document.documentElement.classList.toggle('dark-theme');
  });
}
```

```css
/* انیمیشن تغییر تم */
::view-transition-old(root) {
  animation: fade-out 0.2s ease-in;
}

::view-transition-new(root) {
  animation: fade-in 0.2s ease-out;
}

@keyframes fade-out {
  to { opacity: 0; }
}

@keyframes fade-in {
  from { opacity: 0; }
}
```

## تکنیک‌های پیشرفته

### 1. Conditional Transitions
```javascript
function updateWithCondition(shouldAnimate) {
  if (shouldAnimate && document.startViewTransition) {
    document.startViewTransition(() => updateDOM());
  } else {
    updateDOM();
  }
}
```

### 2. Multiple Named Transitions
```css
.card {
  view-transition-name: var(--card-id);
}

.card-image {
  view-transition-name: var(--card-image-id);
}

.card-title {
  view-transition-name: var(--card-title-id);
}
```

```javascript
function setupCardTransition(cardElement, index) {
  cardElement.style.setProperty('--card-id', `card-${index}`);
  cardElement.querySelector('.image').style.setProperty('--card-image-id', `card-image-${index}`);
  cardElement.querySelector('.title').style.setProperty('--card-title-id', `card-title-${index}`);
}
```

### 3. Transition Groups
```javascript
class TransitionGroup {
  constructor() {
    this.activeTransitions = new Set();
  }
  
  async startTransition(name, updateFn) {
    if (this.activeTransitions.has(name)) {
      return; // جلوگیری از تداخل
    }
    
    this.activeTransitions.add(name);
    
    try {
      const transition = document.startViewTransition(updateFn);
      await transition.finished;
    } finally {
      this.activeTransitions.delete(name);
    }
  }
}
```

## بهینه‌سازی عملکرد

### 1. Reduce Layout Thrashing
```css
/* استفاده از transform به جای تغییر position */
::view-transition-old(item),
::view-transition-new(item) {
  animation: move 0.3s ease-in-out;
}

@keyframes move {
  from { transform: translateX(0); }
  to { transform: translateX(100px); }
}
```

### 2. GPU Acceleration
```css
::view-transition-old(root),
::view-transition-new(root) {
  will-change: transform;
  transform: translateZ(0); /* Force GPU layer */
}
```

### 3. Preload Resources
```javascript
function preloadImages(urls) {
  urls.forEach(url => {
    const img = new Image();
    img.src = url;
  });
}

// Preload قبل از transition
preloadImages(['image1.jpg', 'image2.jpg']);
```

## Accessibility Considerations

### 1. Respect User Preferences
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*) {
    animation-duration: 0.01ms !important;
  }
}
```

### 2. Focus Management
```javascript
function transitionWithFocus(updateFn, focusTarget) {
  document.startViewTransition(() => {
    updateFn();
    
    // Focus management بعد از transition
    requestAnimationFrame(() => {
      if (focusTarget) {
        focusTarget.focus();
      }
    });
  });
}
```

## Browser Support و Fallbacks

### 1. Feature Detection
```javascript
function supportsViewTransitions() {
  return 'startViewTransition' in document;
}

function updateWithFallback(updateFn) {
  if (supportsViewTransitions()) {
    document.startViewTransition(updateFn);
  } else {
    // Fallback animation
    animateWithCSS(updateFn);
  }
}
```

### 2. Progressive Enhancement
```javascript
class ViewTransitionManager {
  constructor() {
    this.supported = supportsViewTransitions();
  }
  
  transition(updateFn, fallbackFn) {
    if (this.supported) {
      return document.startViewTransition(updateFn);
    } else {
      updateFn();
      if (fallbackFn) fallbackFn();
    }
  }
}
```

## ابزارها و کتابخانه‌ها

### 1. React Integration
```jsx
import { useViewTransition } from './hooks/useViewTransition';

function MyComponent() {
  const startTransition = useViewTransition();
  
  const handleUpdate = () => {
    startTransition(() => {
      setContent(newContent);
    });
  };
  
  return <button onClick={handleUpdate}>Update</button>;
}
```

### 2. Vue Integration
```vue
<template>
  <div>
    <button @click="updateWithTransition">Update</button>
  </div>
</template>

<script>
export default {
  methods: {
    updateWithTransition() {
      if (document.startViewTransition) {
        document.startViewTransition(() => {
          this.updateData();
        });
      } else {
        this.updateData();
      }
    }
  }
}
</script>
```

## نتیجه‌گیری

View Transition API ابزار قدرتمندی برای ایجاد تجربه‌های کاربری روان و حرفه‌ای است. با استفاده صحیح از این API می‌توانید:

- **انیمیشن‌های طبیعی** بین تغییرات ایجاد کنید
- **عملکرد بهتر** نسبت به راه‌حل‌های JavaScript داشته باشید
- **تجربه native-like** در وب ارائه دهید

### نکات کلیدی:
1. همیشه fallback برای مرورگرهای قدیمی در نظر بگیرید
2. به accessibility توجه کنید
3. از GPU acceleration استفاده کنید
4. انیمیشن‌ها را ساده و معنادار نگه دارید

با پیشرفت browser support، View Transition API به زودی استاندارد جدید برای انیمیشن‌های وب خواهد شد.
